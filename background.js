//create local storage to store dict and setting
//setting is state of tool (TRUE is running otherwise FALSE is not running)
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        "dict": [

        ]
        ,
        "setting": {
            "isActived": "TRUE"
        }
    })
})

//define where content script is running
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    //inject ingame_script.js if current tab is on speed review page
    let regexInGame = new RegExp(/^https:\/\/app.memrise.com\/aprender\/speed/,)
    if (changeInfo.status === 'complete' && regexInGame.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./ingame_script.js"]
        })
            .then(() => {
                console.log("inject ingame_script scipt")
            })
            .catch(err => console.log(err))
    }

    //inject dict_script if current tab is in new word learning page
    let regexInDict = new RegExp(/^https:\/\/app.memrise.com\/course\/[0-9]+\/[\w-]+\/[0-9]+/,)
    if (changeInfo.status === 'complete' && regexInDict.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./dict_script.js"]
        })
            .then(() => {
                console.log("inject dict_script scipt")
            })
            .catch(err => console.log(err))
    }
})

//use to get message from any content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    //get message from popup_script to crawl data from learning page
    if (request.crawlData) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            //notify to dict_script afterthat get data from dict_sript'message and pass it into 'response' variable
            chrome.tabs.sendMessage(tabs[0].id, { crawlData: "TRUE" }, (response) => {

                //get dict from local.storage and pass into 'result' variable
                chrome.storage.local.get("dict", function (result) {
                    let data

                    //if dict is empty create new dict else update dict
                    if (Object.keys(result["dict"]).length === 0) {
                        data = response
                    } else {

                        //oldData variable is used to storage old dict
                        let oldData = result["dict"]

                        //push new data to old dict
                        response.forEach(element => {
                            oldData.push(element)
                        })

                        //tempData variable is used to store new dict (there may be duplicate data)
                        var tempData = new Map()

                        //remove duplicate data in new dict
                        oldData.forEach(element => {
                            tempData.set(JSON.stringify(element), element)
                        })

                        //assign new dict to data variable
                        data = [...tempData.values()]
                    }

                    //update new dict to local storage and responde message to popup_script
                    chrome.storage.local.set({ "dict": data }, () => {
                        sendResponse({ crawledData: "OK" })
                        return
                    })
                })
            })
        })
        //use return to respond asynchronously
        return true
    }

    //get message from popup_script to change setting isActived from learning page and notify it to ingame_script
    if (request.changeActived) {
        chrome.storage.local.set({ "setting": { "isActived": request.changeActived }, }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

                //respond message if in speed review page(change isActived variable in ingame_script) otherwise only change setting in local storage
                let regexInGame = new RegExp(/^https:\/\/app.memrise.com\/aprender\/speed/,)
                if (regexInGame.test(tabs[0].url)) {
                    chrome.tabs.sendMessage(tabs[0].id, { changeActived: request.changeActived })
                }
            })
        })
    }

    //get message from popup_script to add new word manual from input in popup
    if (request.addNewWord) {
        let newWord = request.addNewWord
        chrome.storage.local.get("dict", function (result) {
            let data

            //check if dict is empty
            if (Object.keys(result["dict"]).length === 0) {
                data = [newWord]
                chrome.storage.local.set({ "dict": data }, () => {
                    sendResponse({ addedNewWord: "OK" })
                    return
                })
            } else {
                let oldData = result["dict"]

                //check if new word is exist in dict return false otherwise add to dict
                for (const element of oldData) {
                    if (Object.keys(element)[0] === Object.keys(newWord)[0]) {
                        sendResponse({ addedNewWord: "Word is exist" })
                        return
                    }
                }
                oldData.push(newWord)
                data = oldData
                chrome.storage.local.set({ "dict": data }, () => {
                    sendResponse({ addedNewWord: "OK" })
                    return
                })
            }

        })
        return true
    }

})
//get setting isActived in local storage to check radio input
chrome.storage.local.get("setting", data => {
    if (data["setting"]["isActived"] === "TRUE") {
        document.getElementById("on").checked = true
    } else {
        document.getElementById("off").checked = true
    }
})

//add event listerner to radio input if change, notify to background
document.body.addEventListener('change', (e) => {
    switch (e.target.id) {
        case 'on':
            chrome.runtime.sendMessage({ changeActived: "TRUE" })
            break
        case 'off':
            chrome.runtime.sendMessage({ changeActived: "FALSE" })
            break
    }
})

//add event listerner to button if click, notify to dict_script
document.getElementById("btnCrawlData").addEventListener('click', () => {
    chrome.runtime.sendMessage({ crawlData: "TRUE" }, (response) => {
        alert(response.crawledData)
    })
})

//add event listerner to button if click, get value from inputs and notify to background
document.getElementById("btnAddNewWord").addEventListener('click', () => {
    let txtEnglish = document.getElementById('txtEnglish').value.trim()
    let txtVietnamese = document.getElementById('txtVietnamese').value.trim()

    if (!txtEnglish.length || !txtVietnamese.length) {
        alert("Please fill all input!")
    } else {
        let englishWord = txtEnglish
        let vietnameseWord = txtVietnamese
        chrome.runtime.sendMessage({ "addNewWord": { [vietnameseWord]: englishWord } }, (response) => {
            alert(response.addedNewWord)
        })
    }
})



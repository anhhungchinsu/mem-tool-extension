//if TRUE tool running in speed review page
var isActived

//get dict from local storage and run scipt
chrome.storage.local.get("dict", data => {
    setInterval(() => {
        if (isActived === "TRUE") {
            choose(data["dict"])
        }
    }, 2000);
})

//get setting in local storage and assign it to isActived variable
chrome.storage.local.get("setting", data => {
    isActived = data["setting"].isActived
})

//get notify from background and change isActived variable
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.changeActived === "TRUE") {
        isActived = "TRUE"
    } else {
        isActived = "FALSE"
    }
})

//script to run in speed review page
function choose(dict) {

    //click button to go next review game in success page(after complete review game)
    let btnContinue = document.getElementsByClassName("sc-bdnxRM dpIChl")
    if (btnContinue.length != 0) {
        btnContinue[0].click()
    }

    let btnClassicReview = document.getElementsByClassName("sc-gtsrHT fjYNDf")
    if (btnClassicReview.length != 0) {
        for (let item of btnClassicReview) {
            if (item.getAttribute("aria-label") === "speed_review") {
                item.click()
            }
        }
    }

    //get key and answer, compare it in dict and choose correct answer
    let word = document.getElementsByClassName("sc-c3nzy8-2 iLKkhm")
    let divAnswer = document.getElementsByClassName("sc-kEqXSa jnBOaB")
    let button = document.getElementsByClassName("sc-bdnxRM nYMsx")

    if (word.length === 0 || divAnswer === 0) {
        return
    }

    for (let element of dict) {
        if (Object.keys(element)[0] === word[0].innerHTML) {
            for (let i = 0; i < 4; i++) {
                if (element[Object.keys(element)[0]] === divAnswer[i].innerHTML && button.length != 0) {
                    button[i].click()
                }
            }
        }
    }
}


//get notify from background and crawl data from learning page and response to background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.crawlData === "TRUE") {

        let english = document.getElementsByClassName('col_a')
        let vietnamese = document.getElementsByClassName('col_b')
        let dictJSON = []

        for (let i = 0; i < english.length; i++) {
            let vietnameseWord = vietnamese[i].outerText
            let englishWord = english[i].outerText
            dictJSON.push({
                [vietnameseWord]: englishWord
            })
        }

        sendResponse(dictJSON);
    }
})
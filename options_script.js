//get dict from local storage and show it
chrome.storage.local.get("dict", data => {
    let table = document.getElementById('wordTable')
    for (const element of data["dict"]) {
        let row = table.insertRow(0)
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = Object.keys(element)[0]
        cell2.innerHTML = element[Object.keys(element)[0]]
    }
})
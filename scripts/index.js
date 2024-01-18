
console.log(123)
// https://stackoverflow.com/questions/45179138/sending-message-from-popup-to-content-script-chrome-extension
test.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {msg:"start"}, (response) => {window.close();});
    });
});

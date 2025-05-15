chrome.webNavigation.onCompleted.addListener(() => {
    console.log("Navigation completed")
})

function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      resolve(tabs.length ? tabs[0].id : null)
    });
  })
}
// 监听popup消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { type, value, from } = request;
  if (type === "hr-online-change") {
    // 发送消息给content
    const tabId = await getCurrentTabId();
    chrome.tabs.sendMessage(tabId, { from: 'bg', type, value });
    chrome.storage.local.set({ "hr-online-status": value }).then(() => {
        console.log("Value is set");
    });
  }
})
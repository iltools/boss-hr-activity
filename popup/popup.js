

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("hr-online").onchange = (e) => {
    // 通知后台
    chrome.runtime.sendMessage({
            type: "hr-online-change",
            value: e.target.checked,
            from: "popup"
        });
    }
    chrome.storage.local.get(["hr-online-status"]).then((result) => {
        // 取缓存数据
        document.getElementById("hr-online").checked = result["hr-online-status"];
    });
})

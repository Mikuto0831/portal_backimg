chrome.runtime.onInstalled.addListener(function (details) {
    // インストール時の挙動
    if (details.reason === "install") {
        syncStorageInit()
        chrome.tabs.create({ "url": "https://github.com/Mikuto0831/portal_backimg/wiki/install" })
    }

    // アップデート時の挙動
    else if (details.reason === "update") {
        chrome.tabs.create({ "url": "https://github.com/Mikuto0831/portal_backimg/wiki/update" })
    }
});

/**
 * chromにある拡張機能用同期ストレージを初期化する
 */
function syncStorageInit() {
    const defaultSettings = {
        "img_url": "",
        "dark_mode": false,
    };

    chrome.storage.sync.set(defaultSettings, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log("Initial settings set.");
        }
    });
}
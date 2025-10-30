chrome.runtime.onInstalled.addListener(function (details) {
    // インストール時の挙動
    if (details.reason === "install") {
        syncStorageInit()
        chrome.tabs.create({ "url": "https://github.com/Mikuto0831/portal_backimg/wiki/install" })
    }

    // アップデート時の挙動
    else if (details.reason === "update") {
        // 既存の設定を取得して、新しいキーがなければ追加
        chrome.storage.sync.get(null, function (data) {
            if (!data.hasOwnProperty("hide_chat_agent")) {
                chrome.storage.sync.set({ "hide_chat_agent": true }, function () {
                    console.log("Added hide_chat_agent setting on update.");
                });
            }
        });
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
        "hide_chat_agent": true,
    };

    chrome.storage.sync.set(defaultSettings, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log("Initial settings set.");
        }
    });
}
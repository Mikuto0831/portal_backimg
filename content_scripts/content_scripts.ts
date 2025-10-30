interface StorageData {
    [index: string]: string | boolean
}

function sleep(ms: number): Promise<void> {
    // msミリ秒後に解決されるPromiseを返す
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * チャットエージェントのiframeを削除する関数（複数回試行）
 * @param {number} maxAttempts 最大試行回数
 * @param {number} delayMs 試行間隔（ミリ秒）
 */
async function removeChatAgentIframe(maxAttempts: number = 5, delayMs: number = 500): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const chatAgentIframe: HTMLElement | null = document.querySelector('iframe[title="ChatAgent"]');
        if (chatAgentIframe) {
            chatAgentIframe.remove();
            console.log(`チャットエージェントのiframeを削除しました (試行回数: ${attempt})`);
            return; // 削除成功したら終了
        }

        if (attempt < maxAttempts) {
            console.log(`チャットエージェントのiframeが見つかりません。${delayMs}ms後に再試行します... (${attempt}/${maxAttempts})`);
            await sleep(delayMs);
        }
    }
    console.log("チャットエージェントのiframeが見つかりませんでした（全試行完了）");
}

/**
 * 背景画像の追加とメニュー欄の背景色に変更を加える関数です
 * @param {string} url 画像URL
 * @param {boolean} dark_mode ダークモードのon/off
 * @param {boolean} hide_chat_agent チャットエージェントの非表示on/off
 */
async function changeBackground(url: string, dark_mode: boolean, hide_chat_agent: boolean) {
    console.log("変更を加えています\n画像URL: ");
    console.log(url);
    console.log("ダークモード:");
    console.log(dark_mode)
    console.log("チャットエージェント非表示:");
    console.log(hide_chat_agent)

    // 背景画像の設定
    document.body.style.backgroundImage = 'url("' + url + '")'; // 背景画像URL
    document.body.style.backgroundPosition = 'center center'; // 背景位置
    document.body.style.backgroundRepeat = 'no-repeat'; // 背景の繰り返し
    document.body.style.backgroundAttachment = "fixed"; // 背景がスクロールで動くか(?)
    document.body.style.backgroundSize = "cover"; // 背景サイズ

    // ダークモード設定
    let backgroundColor, buttonDackgroundColor, border, filter;
    if (dark_mode) {
        backgroundColor = "#000000e0"
        buttonDackgroundColor = "#646464e0"
        border = "solid 3px #DDDDDD"
        document.body.style.color = "#ffffff"
        filter = "invert(100%)"
    } else {
        backgroundColor = "#ffffffe0"
        buttonDackgroundColor = "#ffffffe0"
        border = "solid 3px #222222"
        document.body.style.color = "#000000"
        filter = ""
    }

    // チャットエージェントのiframeを削除（複数回試行）
    if (hide_chat_agent) {
        removeChatAgentIframe(10, 10); // 非同期で実行（バックグラウンドで試行を続ける）
    }

    // こうかとんのメッセージを乗っ取る
    const kokatonMessageElement: HTMLElement | null = document.querySelector(".kokaton-messege .message");
    if (kokatonMessageElement) {
        kokatonMessageElement.textContent = ""
        kokatonMessageElement.insertAdjacentHTML(
            "afterbegin",
            "<a href='https://github.com/Mikuto0831/portal_backimg/wiki' target='_blank' rel='noopener noreferrer'>Using Background Image config for TUT Potal</a> by <a href='https://x.com/Mikuto_0831' target='_blank' rel='noopener noreferrer'>Mikuto</a><br><a href='https://ofuse.me/o?uid=79702' target='_blank' rel='noopener noreferrer'>ここをクリックしてメッセージを送って開発支援・応援しよう</a>"
        );
    }

    // こうかとんの画像を乗っ取る
    const kokatonImgElement: HTMLElement | null = document.querySelector(".kokaton-messege .avatar");
    if (kokatonImgElement) {
        kokatonImgElement.style.backgroundImage = "url('https://avatars.githubusercontent.com/u/152457695?v=4')"
    }


    // 各メニュー欄の背景色設定
    const elements: NodeListOf<HTMLParagraphElement> = document.querySelectorAll(".l__item, .group, .m__header, .m__footer, .c__page-menu, .c__list-menu a,.c__list-menu .symbol, .-lv1, .modal-foot, .c__class-data") as NodeListOf<HTMLParagraphElement>;
    elements.forEach((element => element.style.backgroundColor = backgroundColor));

    const messageBox = document.getElementsByClassName("message")
    for (let i = 0; i < messageBox.length; i++) {
        (messageBox[i] as HTMLParagraphElement).style.color = "#000000"
    }

    // アイコンの色反転
    const icons = document.getElementsByClassName("icon")
    for (let i = 0; i < icons.length; i++) {
        const icon = icons[i] as HTMLParagraphElement;
        icon.style.filter = filter
    }

    await sleep(200);

    // 一部ボタンの色変更
    const blacks = document.getElementsByClassName("e__btn")
    for (let i = 0; i < blacks.length; i++) {
        const element = blacks[i] as HTMLParagraphElement
        element.style.border = border
        element.style.backgroundColor = backgroundColor
    }

    const inputTexts = document.getElementsByClassName("e__fld");
    for (let i = 0; i < inputTexts.length; i++) {
        const element = inputTexts[i] as HTMLParagraphElement;
        element.style.color = "#000000";
    }
    const buttonElements: NodeListOf<HTMLParagraphElement> = document.querySelectorAll(".c__list-menu a, .close, .c__list-menu .symbol") as NodeListOf<HTMLParagraphElement>;
    buttonElements.forEach((element => element.style.backgroundColor = buttonDackgroundColor));

    setButtonEvent()

    console.log("変更が終了しました");
}

/**
 * chromeの同期ストレージからデータを取得し、chengeBackgroundImageへ画像URLを渡す関数です
 */
function load2Call() {
    // chromeの同期ストレージからデータを取得し、chengeBackgroundImageへ画像URLを渡す
    chrome.storage.sync.get(["img_url", "dark_mode", "hide_chat_agent"], function (data: StorageData) {
        const url = data["img_url"] as string;
        const dark_mode = data["dark_mode"] as boolean;
        const hide_chat_agent = data["hide_chat_agent"] !== undefined ? data["hide_chat_agent"] as boolean : true;
        changeBackground(url, dark_mode, hide_chat_agent);
    });
}

async function setButtonEvent() {
    while (!document.getElementById('eye-form-status-button')) {
        await sleep(5)
    }
    document.getElementById('eye-form-status-button')!.addEventListener('click', load2Call);
}

window.addEventListener('load', load2Call);
chrome.storage.onChanged.addListener(function () {
    load2Call();
});

// チャットエージェントが後から追加される場合に備えて、定期的に監視
chrome.storage.sync.get(["hide_chat_agent"], function (data: StorageData) {
    const hide_chat_agent = data["hide_chat_agent"] !== undefined ? data["hide_chat_agent"] as boolean : true;
    if (hide_chat_agent) {
        // ページ読み込み直後に複数回試行
        removeChatAgentIframe(5, 500);

        // さらに遅延してから追加で試行（動的に追加される場合に対応）
        setTimeout(() => {
            removeChatAgentIframe(3, 1000);
        }, 3000);
    }
});
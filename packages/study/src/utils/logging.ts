// DOM操作のログ関連ユーティリティ

/**
 * ログメッセージをデバッグログエリアに追加する関数
 * @param message ログに表示するメッセージ
 */
export function log(message: string): void {
    const logItem = document.createElement('div');
    logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    document.getElementById('debug-log')?.prepend(logItem);
}

/**
 * デバッグログエリアをクリアする関数
 */
export function clearLog(): void {
    const debugLog = document.getElementById('debug-log');
    if (debugLog) {
        debugLog.innerHTML = '';
    }
}

/**
 * VNodeを表示用にフォーマットする関数
 * @param vnode フォーマットする仮想ノード
 * @returns フォーマットされたJSON文字列
 */
export function formatVNode(vnode: any | null): string {
    if (vnode === null) return 'null';

    return JSON.stringify(vnode, (key, value) => {
        // el（DOM要素）は除外
        if (key === 'el') return undefined;
        // Symbolをちゃんと表示
        if (typeof value === 'symbol') return value.toString();
        return value;
    }, 2);
}
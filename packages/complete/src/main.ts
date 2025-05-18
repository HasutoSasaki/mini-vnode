import { createRenderer } from './core/renderer';
import { h, createTextVNode, VNode } from './core/vnode';

// レンダラーの作成
const { render } = createRenderer();
const container = document.getElementById('render-container') as HTMLElement;
const oldVNodeDisplay = document.getElementById('old-vnode') as HTMLElement;
const newVNodeDisplay = document.getElementById('new-vnode') as HTMLElement;
const debugLog = document.getElementById('debug-log') as HTMLElement;

// DOM操作をモニタリングするためのログ関数
function log(message: string) {
    // 元のネイティブメソッドを使用してDOM要素を作成
    const logItem = originalCreateElement('div');
    logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    debugLog.prepend(logItem);

    // 最大50件のログを保持
    if (debugLog.children.length > 50) {
        debugLog.removeChild(debugLog.lastChild!);
    }
}

// オリジナルのDOM操作をオーバーライドしてログを追加
const originalCreateElement = document.createElement.bind(document);
document.createElement = function (tagName: string) {
    const element = originalCreateElement(tagName);
    log(`createElement: <${tagName}>`);
    return element;
};

const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
    log(`setAttribute: ${name}="${value}" on <${this.tagName.toLowerCase()}>`);
    return originalSetAttribute.call(this, name, value);
};

const originalRemoveAttribute = Element.prototype.removeAttribute;
Element.prototype.removeAttribute = function (name: string) {
    log(`removeAttribute: ${name} from <${this.tagName.toLowerCase()}>`);
    return originalRemoveAttribute.call(this, name);
};

const originalInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    log(`insertBefore: ${nodeToString(newNode)} into <${this.nodeName.toLowerCase()}>`);
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
};

const originalRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function <T extends Node>(child: T): T {
    log(`removeChild: ${nodeToString(child)} from <${this.nodeName.toLowerCase()}>`);
    return originalRemoveChild.call(this, child) as T;
};

function nodeToString(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        const nodeValue = (node as Text).nodeValue || '';
        return `"${nodeValue.slice(0, 15)}${nodeValue.length > 15 ? '...' : ''}"`;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        return `<${(node as Element).tagName.toLowerCase()}>`;
    }
    return `${node.nodeName}`;
}

// VNodeを表示用にフォーマットする関数
function formatVNode(vnode: VNode | null): string {
    if (vnode === null) return 'null';

    return JSON.stringify(vnode, (key, value) => {
        // el（DOM要素）は除外
        if (key === 'el') return undefined;
        // Symbolをちゃんと表示
        if (typeof value === 'symbol') return value.toString();
        return value;
    }, 2);
}

// 2つのVNodeの差分をハイライトして表示
function displayVNodes(oldVNode: VNode | null, newVNode: VNode | null) {
    oldVNodeDisplay.textContent = formatVNode(oldVNode);
    newVNodeDisplay.textContent = formatVNode(newVNode);
}

// 状態
let count = 0;
let message = 'こんにちは、仮想DOM!';
let items: string[] = ['アイテム1'];
let useRedStyle = false;

// 初期VNode
let currentVNode: VNode | null = null;

// VNodeを生成する関数
function createVNode() {
    return h('div', null, [
        h('h3', null, `カウント: ${count}`),
        h('p', { class: useRedStyle ? 'text-red' : '', style: useRedStyle ? 'color: red; font-weight: bold;' : '' }, message),
        h('ul', null,
            items.map((item, index) =>
                h('li', { key: index }, item)
            )
        )
    ]);
}

// 初期レンダリング
function initialRender() {
    currentVNode = createVNode();
    displayVNodes(null, currentVNode);
    render(currentVNode, container);
    log('初期レンダリング完了');
}

// VNodeを更新する関数
function updateVNode() {
    const oldVNode = currentVNode;
    currentVNode = createVNode();
    displayVNodes(oldVNode, currentVNode);
    render(currentVNode, container);
    log('更新レンダリング完了');
}

// イベントハンドラの設定
document.getElementById('increment')?.addEventListener('click', () => {
    count++;
    updateVNode();
});

document.getElementById('decrement')?.addEventListener('click', () => {
    count--;
    updateVNode();
});

document.getElementById('change-text')?.addEventListener('click', () => {
    message = message === 'こんにちは、仮想DOM!'
        ? 'テキストが変更されました！'
        : 'こんにちは、仮想DOM!';
    updateVNode();
});

document.getElementById('add-list-item')?.addEventListener('click', () => {
    items.push(`アイテム${items.length + 1}`);
    updateVNode();
});

document.getElementById('style-toggle')?.addEventListener('click', () => {
    useRedStyle = !useRedStyle;
    updateVNode();
});

// 初期レンダリング実行
initialRender();
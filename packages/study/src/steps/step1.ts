// ステップ1: 基本的な要素のレンダリング
import { h, type VNode } from '@study/core/vnode';
import { log } from '../utils/logging';

// DOM操作に関する型定義
type RendererNode = HTMLElement | Text;
type Container = HTMLElement;

// レンダラーの作成関数
function createBasicRenderer() {
    // 要素の作成
    const createElement = (type: string): HTMLElement => {
        log(`createElement: <${type}>を作成`);
        return document.createElement(type);
    };

    // 要素を親要素に挿入
    const insert = (child: RendererNode, parent: Container): void => {
        log(`insert: <${parent.tagName.toLowerCase()}>に子要素を挿入`);
        parent.appendChild(child);
    };

    // 単純な要素のマウント処理
    const mountElement = (vnode: VNode, container: Container): void => {
        const { type, children } = vnode;
        log(`mountElement: <${String(type)}>要素のマウント開始`);

        const el = (vnode.el = createElement(String(type)));

        // 単純なテキスト子要素の処理 (このステップでは文字列のみサポート)
        if (typeof children === 'string') {
            log(`mountElement: テキスト "${children}" を設定`);
            el.textContent = children;
        }

        // DOMに挿入
        insert(el, container);
        log(`mountElement: <${String(type)}>要素のマウント完了`);
    };

    // 単純なレンダリング関数
    const render = (vnode: any, container: Container): void => {
        log(`render: レンダリング開始`);
        if (vnode) {
            mountElement(vnode, container);
        } else {
            container.innerHTML = '';
        }
        log(`render: レンダリング完了`);
    };

    return {
        render
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const { render } = createBasicRenderer();

    const vnode = h('div', null, 'Hello World');

    const container = document.getElementById('app') as HTMLElement;
    if (container) {
        render(vnode, container);
    }
});
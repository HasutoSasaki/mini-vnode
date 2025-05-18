import { VNode, VNodeType, Text } from './vnode'

// DOM操作に関する型定義
type RendererNode = HTMLElement | Text
type Container = HTMLElement

// レンダラーの作成関数
export function createRenderer() {
    // 要素の作成
    const createElement = (type: string): HTMLElement => {
        return document.createElement(type)
    }

    // テキストノードの作成
    const createText = (text: string): Text => {
        return document.createTextNode(text)
    }

    // 要素を親要素に挿入
    const insert = (child: RendererNode, parent: HTMLElement, anchor: RendererNode | null = null) => {
        parent.insertBefore(child, anchor)
    }

    // テキストの設定
    const setText = (node: Text, text: string) => {
        node.nodeValue = text
    }

    // 属性の設定
    const patchProp = (el: HTMLElement, key: string, prevValue: any, nextValue: any) => {
        // イベントハンドラの場合 (on + 大文字で始まる)
        if (key.startsWith('on') && key.length > 2) {
            const event = key.slice(2).toLowerCase()

            // 以前のハンドラを削除
            if (prevValue) {
                el.removeEventListener(event, prevValue)
            }

            // 新しいハンドラを追加
            if (nextValue) {
                el.addEventListener(event, nextValue)
            }
        } else {
            // 通常の属性の場合
            if (nextValue === null || nextValue === undefined) {
                el.removeAttribute(key)
            } else {
                el.setAttribute(key, nextValue)
            }
        }
    }

    // 要素の削除
    const remove = (child: RendererNode) => {
        const parent = child.parentNode
        if (parent) {
            parent.removeChild(child)
        }
    }

    // VNodeをDOM要素にマウント
    const mountElement = (vnode: VNode, container: Container, anchor: RendererNode | null = null) => {
        const { type, props, children } = vnode

        // 要素の作成
        const el = (vnode.el = createElement(type as string))

        // 子要素の処理
        if (typeof children === 'string') {
            // 文字列の場合はテキストノードとして設定
            el.textContent = children
        } else if (Array.isArray(children)) {
            // 配列の場合は各子要素を再帰的にマウント
            for (const child of children) {
                patch(null, child, el)
            }
        } else if (children) {
            // 単一のVNodeの場合
            patch(null, children as VNode, el)
        }

        // 属性の設定
        if (props) {
            for (const key in props) {
                patchProp(el, key, null, props[key])
            }
        }

        // DOMに挿入
        insert(el, container, anchor)
    }

    // テキストノードの処理
    const processText = (n1: VNode | null, n2: VNode, container: Container, anchor: RendererNode | null = null) => {
        if (n1 === null) {
            // 新規作成
            const textNode = (n2.el = createText(n2.children as string))
            insert(textNode, container, anchor)
        } else {
            // 更新
            const el = (n2.el = n1.el as Text)
            if (n2.children !== n1.children) {
                setText(el, n2.children as string)
            }
        }
    }

    // 要素の更新
    const patchElement = (n1: VNode, n2: VNode) => {
        const el = (n2.el = n1.el) as HTMLElement
        const oldProps = n1.props || {}
        const newProps = n2.props || {}

        // 属性の更新
        for (const key in newProps) {
            const prev = oldProps[key]
            const next = newProps[key]
            if (prev !== next) {
                patchProp(el, key, prev, next)
            }
        }

        // 不要な属性の削除
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patchProp(el, key, oldProps[key], null)
            }
        }

        // 子要素の更新
        patchChildren(n1, n2, el)
    }

    // 子要素の差分更新
    const patchChildren = (n1: VNode, n2: VNode, container: HTMLElement) => {
        const c1 = n1.children
        const c2 = n2.children

        // テキストノードへの変更
        if (typeof c2 === 'string') {
            if (Array.isArray(c1)) {
                // 前の子要素を全て削除
                for (const child of c1) {
                    remove(child.el!)
                }
            }
            // 新しいテキストを設定
            container.textContent = c2
        }
        // 配列への変更
        else if (Array.isArray(c2)) {
            if (Array.isArray(c1)) {
                // 両方とも配列の場合、要素の比較と更新が必要
                // シンプルな実装では、古い子要素をすべて削除して新しい子要素を追加
                for (const child of c1) {
                    remove(child.el!)
                }
                for (const child of c2) {
                    patch(null, child, container)
                }
            } else {
                // 前の子要素がテキストかVNodeの場合は、コンテナの内容をクリアして新しい子要素を追加
                container.textContent = ''
                for (const child of c2) {
                    patch(null, child, container)
                }
            }
        }
        // 単一のVNodeへの変更
        else if (c2) {
            if (Array.isArray(c1)) {
                // 前の子要素をすべて削除して新しい単一の子要素を追加
                for (const child of c1) {
                    remove(child.el!)
                }
                patch(null, c2 as VNode, container)
            } else {
                // 前の子要素がテキストか単一のVNodeの場合、コンテンツをクリアして新しい子要素を追加
                container.textContent = ''
                patch(null, c2 as VNode, container)
            }
        }
        // 子要素がない場合
        else {
            // 前の子要素がある場合は削除
            if (Array.isArray(c1)) {
                for (const child of c1) {
                    remove(child.el!)
                }
            } else if (c1) {
                container.textContent = ''
            }
        }
    }

    // VNodeを比較して更新する関数
    const patch = (n1: VNode | null, n2: VNode, container: Container, anchor: RendererNode | null = null) => {
        // 以前のVNodeと新しいVNodeの型が異なる場合、前のノードを削除して新しいノードを作成
        if (n1 && n1.type !== n2.type) {
            remove(n1.el!)
            n1 = null
        }

        const { type } = n2

        // テキストノードの処理
        if (type === Text) {
            processText(n1, n2, container, anchor)
        }
        // 要素ノードの処理
        else if (typeof type === 'string') {
            if (!n1) {
                // 新しい要素のマウント
                mountElement(n2, container, anchor)
            } else {
                // 既存の要素の更新
                patchElement(n1, n2)
            }
        }
    }

    // ルートレンダリング関数
    const render = (vnode: VNode | null, container: Container) => {
        // コンテナ内の以前のノードを取得
        const prevVNode = container._vnode || null

        if (vnode) {
            // 差分更新
            patch(prevVNode, vnode, container)
        } else if (prevVNode) {
            // vnodeがnullの場合は、コンテナをクリア
            container.innerHTML = ''
        }

        // 現在のVNodeを保存
        container._vnode = vnode
    }

    return {
        render
    }
}
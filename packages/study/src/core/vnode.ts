export type VNodeType = string | typeof Text
export type VNodeChildren = string | VNode | VNode[]

export interface VNodeProps {
    [key: string]: any
}

export interface VNode {
    type: VNodeType
    props: VNodeProps | null
    children: VNodeChildren
    el?: HTMLElement | Text
}

export const Text = Symbol('Text')

export function h(
    type: VNodeType,
    props: VNodeProps | null = null,
    children: VNodeChildren = []
): VNode {
    return {
        type,
        props,
        children,
    }
}

export function createTextVNode(text: string): VNode {
    return {
        type: Text,
        props: null,
        children: text,
    }
}
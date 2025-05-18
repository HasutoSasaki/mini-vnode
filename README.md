# mini-vnode

Vue.js 風の仮想 DOM 実装を理解するためのデモプロジェクトです。このプロジェクトでは、仮想 DOM の基本的な概念と動作原理を視覚的に学ぶことができます。

## 概要

仮想 DOM（Virtual DOM）は、実際の DOM ツリーを抽象化した軽量な JavaScript オブジェクトのツリーです。UI の変更があると、まず仮想 DOM ツリーを更新し、前回のツリーと比較（diffing）して、実際に変更が必要な部分だけを実際の DOM に適用します。

このデモでは以下の機能を実装しています：

- 仮想ノード（VNode）の構造と作成
- レンダリングと差分検出（パッチング）アルゴリズム
- DOM 操作のログ表示
- 状態変更とレンダリングの関係の可視化

## フォルダ構成

- `packages/study`: 学習用の段階的な実装
- `packages/complete`: 完成版の実装

詳しい使い方や実装内容については、[USAGE.md](./USAGE.md)を参照してください。

## 参考文献

このプロジェクトは、以下の資料を参考にしています：

- [The chibivue Book - 小さい仮想 DOM](https://book.chibivue.land/ja/10-minimum-example/040-minimum-virtual-dom.html)

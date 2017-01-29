# コマンドラインアプリケーション(CLI アプリ)作成用テンプレート(Node.js)

[main.js](app/main.js)を編集して、CLIアプリを実装してください。  
チャレンジ内でファイルの作成が許可されていれば、可読性等のためにファイルを分割する事も可能です。

## コマンドライン引数の取得方法
[main.js](app/main.js) に定義されている `main` という関数から `argv` の名前で取得可能です。

``` js
function main(argv) {
  // code to run
}
```

ここの argv は `process.argv` の内容がそのまま渡されています。

## コマンド実行結果の標準出力への出力
`stdout`への出力は標準の`console.log()`メソッドを使用してください。

``` js
console.log(result);
```

## 外部ライブラリの追加方法
外部ライブラリを使用する場合は以下の手順で実施してください。

- [package.json](package.json) に依存関係を追加

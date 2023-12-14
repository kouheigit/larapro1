# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## ローカルでの表示確認 / 開発

#### `npm i`
#### `npm start`
[http://localhost:3000](http://localhost:3000) をブラウザで開く。この状態で開発する\
ダミーのままになってるテキストを何とかする。

## 本番用ビルド

#### `npm run build`
`build` フォルダが作られるので、この中身を任意のサーバーに上げる.

## 変更が必要な箇所
サイト公開前に変更しておく箇所
### ReCAPCHA V2 のキー
`Entry.tsx`290行目, `Contact.tsx`108行目\
自前のキーを発行して置き換えてください。
### Formの送信先URL
`Entry.tsx`84行目, `Contact.tsx`46行目\
メール送信用APIを作って、そこに投げるように変更してください。\
ちゃんと全要素飛んでるのか、動作確認してないです。
### SEO
`public/index.html`を編集
- title
- description
- favicon
- noindex,nofollow外す
- その他、必要なら
  - og
  - GA
  - GoogleTagManager
  - など

設定変更したら`npm run build`してサーバーに上げ直す

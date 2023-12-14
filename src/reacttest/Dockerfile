# ベースイメージとして公式のNode.jsイメージを使用
FROM node:14

# アプリケーションのディレクトリを作成
WORKDIR /app

# ホストのpackage.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# ホストのソースコードをコピー
COPY . .

# アプリケーションをビルド（必要に応じて変更）
RUN npm run build

# アプリケーションを起動
CMD ["npm", "start"]
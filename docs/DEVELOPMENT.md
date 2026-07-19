# 開発者向けメモ

このドキュメントは、Tarkov 武器ビルドシミュレーターの開発・データ更新・公開運用に関するメモです。

利用者向けの説明はルートの [README.md](../README.md) にまとめています。

## ローカル開発

```bash
cd frontend
npm install
npm start
```

ビルド確認:

```bash
cd frontend
npm run build
```

## データ取得

ローカルで使用する武器、パーツ、弾薬データは `frontend/src/data` 配下のJSONとして管理します。

Windowsではリポジトリ直下で以下を実行します。

```bat
fetch-data.bat
```

個別に取得したい場合は、`frontend` ディレクトリで以下を実行します。

```bash
npm run fetch:weapons
npm run fetch:parts
npm run fetch:ammo
```

すべてまとめて取得する場合:

```bash
npm run fetch:data
```

## 公開時のデータ更新方針

公開運用では、データ更新のたびにJSONをコミットし続ける運用は避けます。

推奨方針は、GitHub Actionsで以下を自動実行する形です。

1. GitHub Actionsが定期実行される
2. `npm run fetch:data` で最新データを取得する
3. `npm run build` で静的ファイルを生成する
4. 生成された `frontend/build` だけをGitHub Pagesへデプロイする
5. 取得されたJSONの変更はコミットせず、Actions上の一時ファイルとして破棄する

この方式なら、リポジトリの履歴にデータ更新コミットが増え続けません。

## GitHub Pagesで公開する場合

GitHub Pagesで公開する場合は、GitHub Actionsのデプロイ先を `GitHub Pages` にします。

GitHub側で必要な設定:

- Repository Settingsを開く
- Pagesを開く
- Sourceを `GitHub Actions` にする

GitHub PagesのURLは、通常以下の形式になります。

```txt
https://<GitHubユーザー名>.github.io/<リポジトリ名>/
```

カスタムドメインを使う場合は、GitHub Pages側でドメイン設定を行います。

## 定期実行の目安

データ更新は、まずは1日1回で十分です。

例:

- 日本時間 0時にデータ取得・ビルド・公開
- 必要なときだけ手動実行できるように `workflow_dispatch` も用意

GitHub ActionsのcronはUTC基準です。日本時間0時に実行したい場合は、UTCでは前日の15時です。

```yaml
schedule:
  - cron: "0 15 * * *"
```

## 注意点

- データ取得にはインターネット接続が必要です。
- tarkov.dev API側の仕様変更により、取得項目やカテゴリの調整が必要になる場合があります。
- `frontend/src/data` のJSONを更新したあと、ローカルでは `npm run build` でビルドが通ることを確認してください。
- `npm audit` で脆弱性が表示される場合があります。公開前に影響範囲を確認し、必要に応じて依存関係を更新してください。

# tarkov_weapon_sim

Escape from Tarkov の武器ビルドを確認するためのシミュレーターです。

## データ取得

ローカルで使用する武器・パーツ・弾薬データは、tarkov.dev API から取得して JSON に保存します。

Windows では、リポジトリ直下で以下を実行します。

```bat
fetch-data.bat
```

このバッチは `frontend` ディレクトリへ移動し、以下のコマンドを実行します。

```bash
node scripts/fetchData.js
```

`fetchData.js` は次のデータを順番に更新します。

- メイン武器データ
- 武器パーツデータ
- 弾薬データ

個別に取得したい場合は、`frontend` ディレクトリで以下を実行します。

```bash
npm run fetch:weapons
npm run fetch:parts
npm run fetch:ammo
```

すべてまとめて取得する場合は、以下でも実行できます。

```bash
npm run fetch:data
```

## 注意点

- データ取得時はインターネット接続が必要です。
- 実行すると `frontend/src/data` 配下の JSON が更新されます。
- tarkov.dev API 側の仕様変更により、取得項目やカテゴリの調整が必要になる場合があります。

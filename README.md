# 📝 タスク管理Webアプリケーション

シンプルで直感的なタスク管理Webアプリケーションです。毎日のタスクを効率的に管理できます。

## 機能

✨ **主な機能**

- ✅ タスク作成 - タイトルと説明付きでタスクを作成
- 📝 タスク編集 - 作成したタスクを管理
- ✔️ 完了管理 - タスクの完了状態を管理
- 🗑️ 削除 - 不要なタスクを削除
- 💾 自動保存 - ローカルストレージに自動保存
- 📊 統計表示 - 完了したタスク数を表示

## 技術スタック

- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイル**: CSS
- **ストレージ**: ブラウザのLocalStorage

## インストール

```bash
# 依存パッケージのインストール
npm install
```

## 開発

```bash
# 開発サーバーの起動
npm run dev
```

開発サーバーが起動すると、ブラウザで http://localhost:5173/ にアクセスできます。

## ビルド

```bash
# 本番用にビルド
npm run build
```

## プレビュー

```bash
# ビルド後のプレビュー
npm run preview
```

## 使い方

1. **タスクを追加** - タイトルを入力して「タスクを追加」をクリック
2. **タスクを完了** - タスク左側のチェックボックスをクリック
3. **タスクを削除** - タスク右側の「✕」ボタンをクリック
4. **進捗を確認** - 完了タスク数を上部に表示

## データ保存

すべてのタスクデータはブラウザのLocalStorageに自動保存されます。ブラウザを閉じても、次回アクセス時にタスクが保存されています。

## ブラウザ対応

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

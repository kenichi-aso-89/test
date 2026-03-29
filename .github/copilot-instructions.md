# タスク管理Webアプリケーション - プロジェクト設定

## プロジェクト概要
- **プロジェクトタイプ**: Vite + React
- **フレームワーク**: React + TypeScript
- **スタイル**: CSS
- **状態管理**: React Hooks
- **ストレージ**: ローカルストレージ

## 進捗チェックリスト

- [x] Verify copilot-instructions.md
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Dependencies
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [x] Documentation Complete

## プロジェクト構成

### ファイル構造
```
src/
├── App.tsx              # メインアプリケーションコンポーネント
├── App.css              # アプリケーションスタイル
├── TaskForm.tsx         # タスク入力フォームコンポーネント
├── TaskForm.css         # フォームスタイル
├── TaskList.tsx         # タスク一覧表示コンポーネント
├── TaskList.css         # 一覧スタイル
├── TaskItem.tsx         # 個別タスク項目コンポーネント
├── TaskItem.css         # アイテムスタイル
├── useTaskManager.ts    # カスタムフック（タスク管理ロジック）
├── types.ts             # TypeScript型定義
├── main.tsx             # エントリーポイント
└── index.css            # グローバルスタイル
```

## 実装された機能

✅ **機能一覧**
- タスク作成（タイトルと説明）
- タスク完了状態管理
- タスク削除
- ローカルストレージへの自動保存
- 完了タスク数の表示
- レスポンシブデザイン
- ダークモード対応

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番用ビルド
npm run preview  # ビルド後のプレビュー
npm run lint     # ESLint実行
```

## 開発環境

- **ローカルURL**: http://localhost:5173/
- **開発サーバー**: Vite 8.0.3
- **Node.js**: v18以上推奨
- **npm**: v9以上推奨

# External Skill Sources

このディレクトリは外部スキル/エージェント資産の参照元です。

## 導入済みソース
- vercel-labs/skills
- anthropics/skills
- vercel-labs/agent-skills
- browser-use/browser-use
- sleekdotdesign/agent-skills

## 更新コマンド
```bash
git submodule update --init --recursive
git submodule update --remote --recursive
```

## 補足
- `browser-use` は純粋な「スキル集」ではなく、ブラウザ自動化フレームワークです。
- そのため、利用時は依存関係や実行環境のセットアップが別途必要です。

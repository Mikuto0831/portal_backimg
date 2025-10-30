# リリース手順

このドキュメントでは、Chrome Web Store向けの新バージョンをリリースする手順を説明します。

## 📋 前提条件

- mainブランチが最新の状態であること
- manifest.jsonのバージョンが更新されていること
- すべての変更がコミット済みであること

## 🚀 リリース手順

### 1. manifest.jsonのバージョンを更新

```json
{
  "version": "1.2.0"  // 新しいバージョン番号に更新
}
```

### 2. 変更をコミット

```bash
git add manifest.json
git commit -m "chore: bump version to 1.2.0"
git push origin main
```

### 3. バージョンタグを作成してプッシュ

```bash
# タグを作成（manifest.jsonのバージョンと一致させる）
git tag v1.2.0

# タグをプッシュ
git push origin v1.2.0
```

### 4. GitHub Actionsの実行を確認

1. GitHubリポジトリの「Actions」タブを開く
2. 「Create Release」ワークフローが実行されていることを確認
3. 実行が完了するまで待つ（通常1-2分）

### 5. リリースを確認

1. GitHubリポジトリの「Releases」タブを開く
2. 新しいリリース（v1.2.0）が作成されていることを確認
3. zipファイル（`portal_backimg_v1.2.0.zip`）がアップロードされていることを確認

### 6. Chrome Web Storeにアップロード

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)にアクセス
2. 拡張機能を選択
3. 「Package」タブで、ダウンロードしたzipファイルをアップロード
4. 変更内容を記入して公開申請

## 🔄 デプロイフロー図

```
開発ブランチ
    ↓
mainにマージ
    ↓
manifest.json更新
    ↓
コミット & プッシュ
    ↓
バージョンタグ作成 (v1.2.0)
    ↓
タグをプッシュ
    ↓
GitHub Actions実行 (自動)
    ↓
GitHub Release作成 (自動)
    ↓
zipファイルダウンロード (手動)
    ↓
Chrome Web Storeアップロード (手動)
```

## ⚠️ 注意事項

### バージョン番号の一致

- manifest.jsonのバージョンとGitタグのバージョンは必ず一致させてください
- 一致しない場合、GitHub Actionsがエラーで停止します

### タグの命名規則

- 必ず `v` で始めてください（例: `v1.2.0`）
- セマンティックバージョニングに従ってください
  - メジャー.マイナー.パッチ（例: `1.2.0`）

### タグの削除・再作成

間違えてタグを作成した場合：

```bash
# ローカルのタグを削除
git tag -d v1.2.0

# リモートのタグを削除
git push origin :refs/tags/v1.2.0

# 正しいタグを作成し直す
git tag v1.2.0
git push origin v1.2.0
```

## 📝 バージョニング規則

[セマンティックバージョニング](https://semver.org/lang/ja/)に従います：

- **メジャーバージョン** (1.x.x): 互換性のない大きな変更
- **マイナーバージョン** (x.1.x): 後方互換性のある機能追加
- **パッチバージョン** (x.x.1): 後方互換性のあるバグ修正

例：
- `1.0.0` → `1.0.1`: バグ修正
- `1.0.1` → `1.1.0`: 新機能追加
- `1.1.0` → `2.0.0`: 大きな変更、破壊的変更

## 🛠️ トラブルシューティング

### GitHub Actionsが失敗する

1. Actionsタブでエラーログを確認
2. バージョン番号の不一致が最も多い原因です
3. manifest.jsonとタグのバージョンを確認

### zipファイルが作成されない

1. タグ名が `v*.*.*` の形式になっているか確認
2. リポジトリの権限設定を確認

### リリースノートを編集したい

1. GitHubのReleasesページで該当リリースを開く
2. 「Edit release」をクリック
3. 内容を編集して保存

#!/usr/bin/env bash
set -e

# Bu betiği çalıştırmadan önce Kobiai_ready/ dizinine geçin:
# cd /path/to/Kobiai_ready

# Yeni git deposu oluştur ve uzak repo ekle
git init
git branch -M main
git remote add origin https://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@github.com/hakkiyuvanc/Kobiai.git

# Tüm dosyaları ekle, commit yap ve zorla push et
git add .
git commit -m "Initial deploy from ChatGPT"
git push -u origin main --force

echo "Deploy tamamlandı!"

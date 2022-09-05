#!/bin/bash
diff <(gron public/locales/ja/translation.json | grep -oE '^[^=]+') <(gron public/locales/en/translation.json | grep -oE '^[^=]+')

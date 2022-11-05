---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

# layout: default
layout: pages
title: OwnServer を使って無料で factorio のサーバーを用意する

namespace: games/factorio
permalink: /games/factorio
permalink_ja: /games/factorio
permalink_en: /games/factorio
---

# factorio サーバーを用意する
## 事前準備
こちらのページから `docker` をダウンロードしてインストールしてください

> Docker Desktop - Docker  
> [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
{: .blockquote }

セーブデータを保存するために、デスクトップなどに新しいフォルダを作成します。  


## factorio サーバーをインターネットに公開する
OwnServer Client を起動して、 `factorio` を選択して *次へ* をクリックします
![](/img/factorio/step_selectgame.png)

*フォルダ選択* をクリックして、先程作成したフォルダを探して開いてください。
次に、 *起動* をクリックして factorio サーバーを起動します。
![](/img/factorio/step_confgame_start.png)

しばらく待ち、 *ゲームサーバーを起動* の状態が `実行中` であることを確認して *次へ* をクリックします。
![](/img/factorio/step_confgame_next.png)

*起動* をクリックすることで、あなたのパソコンで動いている factorio サーバーがインターネットに公開されます！
![](/img/factorio/step_tunnel_start.png)

*OwnServer を起動* のステータスが *実行中* であることを確認して、 *次へ* を選択します。
![](/img/factorio/step_tunnel_next.png)

あなたの factorio サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/factorio/step_monitor.png)

## factorio サーバーに参加する
factorio を起動して、 *マルチプレイ* -> *アドレスに接続* を選択します。

サーバーのアドレスを貼り付けてください。
![](/img/factorio/step_ingame.png)
なお、サーバーのアドレスは OwnServer client を起動するたびに変更されることに注意してください。

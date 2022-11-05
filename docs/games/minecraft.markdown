---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

# layout: default
layout: pages
title: OwnServer を使って無料で Minecraft のサーバーを用意する

namespace: games/minecraft
permalink: /games/minecraft
permalink_ja: /games/minecraft
permalink_en: /games/minecraft
---

# マインクラフトのサーバーを用意する
## 事前準備
こちらの記事を参考にして、 `java` をパソコンにインストールしてください

> チュートリアル/サーバーのセットアップ  
> [https://minecraft.fandom.com/ja/wiki/チュートリアル/サーバーのセットアップ](https://minecraft.fandom.com/ja/wiki/%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB/%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
{: .blockquote }

デスクトップなどに、新しいフォルダを作成します。  
こちらの Web ページから `server.jar` をダウンロードして、先程作成したフォルダの中に配置します

> MINECRAFT: JAVA EDITIONのサーバーをダウンロードします  
> [https://www.minecraft.net/ja-jp/download/server](https://www.minecraft.net/ja-jp/download/server)
{: .blockquote }

OwnServer Client がインストールされていることを確認します。


## Minecraft サーバーをインターネットに公開する
OwnServer Client を起動して、 `Minecraft` を選択して *次へ* をクリックします
![](/img/minecraft/step_selectgame.png)

*server.jar を選択* をクリックして、先程ダウンロードした `server.jar` を探して開いてください。さらに *EULA に同意する* にチェックをいれます。
次に、 *起動* をクリックして Minecraft サーバーを起動します。
セーブデータは `server.jar` があるフォルダに作成されます。
![](/img/minecraft/step_confgame_start.png)

しばらく待ち、 *ゲームサーバーを起動* の状態が `実行中` であることを確認して *次へ* をクリックします。
![](/img/minecraft/step_confgame_next.png)

*起動* をクリックすることで、あなたのパソコンで動いている Minecraft サーバーがインターネットに公開されます！
![](/img/minecraft/step_tunnel_start.png)

*OwnServer を起動* のステータスが *実行中* であることを確認して、 *次へ* を選択します。
![](/img/minecraft/step_tunnel_next.png)

あなたの Minecraft サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/minecraft/step_monitor.png)

## Minecraft サーバーに参加する
Minecraft を起動して、 *Multiplayer* -> *Add Server* を選択します。

サーバーのアドレスを貼り付けてください。
![](/img/minecraft/step_ingame.png)
なお、サーバーのアドレスは OwnServer client を起動するたびに変更されることに注意してください。

## 免責事項
```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

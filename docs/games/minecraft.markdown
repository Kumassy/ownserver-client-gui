---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

# layout: default
layout: pages
title: OwnServer を使って無料で Minecraft のサーバーを用意する
---

# マインクラフトのサーバーを用意する
## 免責事項
```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

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

*ファイル選択* をクリックして、先程ダウンロードした `server.jar` を探して開いてください。 `server.jar` へのパスが表示されます。次に、 *START* をクリックして Minecraft サーバーを起動します。
![](/img/minecraft/step_confgame_start.png)

サーバーを初めてたちあげるときは、しばらく待つと `you need to agree to the EULA in order to run the server.jar` というメッセージが表示されます。 `server.jar` と同じフォルダに作られた `eula.txt` を編集して EULA に同意してください
![](/img/minecraft/step_confgame_eula.png)

しばらく待ち、 *ゲームサーバーを起動* の状態が `Running` かつ、 `Done ! For help, type "help"` という Minecraft サーバーが正常に起動できたことを示すメッセージが表示されたことを確認して、 *次へ* をクリックします。
![](/img/minecraft/step_confgame_next.png)

*START* をクリックすることで、あなたのパソコンで動いている Minecraft サーバーがインターネットに公開されます！
![](/img/minecraft/step_tunnel_start.png)

*OwnServer を起動* のステータスが *Running* であることを確認して、 *次へ* を選択します。
![](/img/minecraft/step_tunnel_next.png)

あなたの Minecraft サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/minecraft/step_monitor.png)

## Minecraft サーバーに参加する
Minecraft を起動して、 *Multiplayer* -> *Add Server* を選択します。

サーバーのアドレスを貼り付けてください。
![](/img/minecraft/step_ingame.png)
なお、サーバーのアドレスは OwnServer client を起動するたびに変更されることに注意してください。

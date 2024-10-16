# Minecraft Forge のサーバーを用意する

## 事前準備

こちらの記事を参考にして、 `java` をパソコンにインストールしてください

> チュートリアル/サーバーのセットアップ  
> [https://minecraft.fandom.com/ja/wiki/チュートリアル/サーバーのセットアップ](https://minecraft.fandom.com/ja/wiki/%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB/%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
> {: .blockquote }

デスクトップなどに、新しいフォルダを作成します。  
こちらの Web ページから `server.jar` をダウンロードして、先程作成したフォルダの中に配置します

> MINECRAFT: JAVA EDITIONのサーバーをダウンロードします  
> [https://www.minecraft.net/ja-jp/download/server](https://www.minecraft.net/ja-jp/download/server)
> {: .blockquote }

OwnServer Client がインストールされていることを確認します。

## Minecraft サーバーをインターネットに公開する

OwnServer Client を起動して、 `Minecraft` を選択して _次へ_ をクリックします
![](/img/{{ site.lang }}/minecraft/step_selectgame.png)

_server.jar を選択_ をクリックして、先程ダウンロードした `server.jar` を探して開いてください。さらに _EULA に同意する_ にチェックをいれます。
次に、 _起動_ をクリックして Minecraft サーバーを起動します。
セーブデータは `server.jar` があるフォルダに作成されます。
![](/img/{{ site.lang }}/minecraft/step_confgame_start.png)

しばらく待ち、 _ゲームサーバーを起動_ の状態が `実行中` であることを確認して _次へ_ をクリックします。
![](/img/{{ site.lang }}/minecraft/step_confgame_next.png)

_起動_ をクリックすることで、あなたのパソコンで動いている Minecraft サーバーがインターネットに公開されます！
![](/img/{{ site.lang }}/minecraft/step_tunnel_start.png)

_OwnServer を起動_ のステータスが _実行中_ であることを確認して、 _次へ_ を選択します。
![](/img/{{ site.lang }}/minecraft/step_tunnel_next.png)

あなたの Minecraft サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/{{ site.lang }}/minecraft/step_monitor.png)

## Minecraft サーバーに参加する

Minecraft を起動して、 *Multiplayer* -> *Add Server* を選択します。

サーバーのアドレスを貼り付けてください。
![](/img/{{ site.lang }}/minecraft/step_ingame.png)
なお、サーバーのアドレスは OwnServer client を起動するたびに変更されることに注意してください。

## 免責事項

```sh {"id":"01JAA83MAFGAXJMDVC009JZVJK"}
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

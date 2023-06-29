# マインクラフトのサーバーを用意する
以下のページでは Windows で動かす場合について説明します

## 事前準備
以下のページから bedrock_server.exe が入った zip ファイルをダウンロードし、展開します

> Bedrock サーバー ダウンロード | Minecraft  
> [https://www.minecraft.net/ja-jp/download/server/bedrock](https://www.minecraft.net/ja-jp/download/server/bedrock)
{: .blockquote }

OwnServer Client がインストールされていることを確認します。

管理者権限でコマンドプロンプトを開き、以下のコマンドを実行します

> 
> CheckNetIsolation.exe LoopbackExempt –a –p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436

![](/img/{{ site.lang }}/minecraft_be/configure_loopback.png)

## Minecraft サーバーをインターネットに公開する
OwnServer Client を起動して、 `Minecraft Bedrock Edition` を選択して *次へ* をクリックします

![](/img/{{ site.lang }}/minecraft_be/step_selectgame.png)

*bedrock_server.exe を選択* をクリックして、先程ダウンロードした `bedrock_server.exe` を探して開いてください。
次に、 *起動* をクリックして Minecraft サーバーを起動します。
セーブデータは `bedrock_server.exe` があるフォルダに作成されます。

![](/img/{{ site.lang }}/minecraft_be/step_confgame_start.png)

しばらく待ち、 *ゲームサーバーを起動* の状態が `実行中` であることを確認して *次へ* をクリックします。

![](/img/{{ site.lang }}/minecraft_be/step_confgame_next.png)

*起動* をクリックすることで、あなたのパソコンで動いている Minecraft サーバーがインターネットに公開されます！

![](/img/{{ site.lang }}/minecraft_be/step_tunnel_start.png)

*OwnServer を起動* のステータスが *実行中* であることを確認して、 *次へ* を選択します。

![](/img/{{ site.lang }}/minecraft_be/step_tunnel_next.png)

あなたの Minecraft サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！

![](/img/{{ site.lang }}/minecraft_be/step_monitor.png)

## Minecraft サーバーに参加する
Minecraft を起動して、 *Multiplayer* -> *Add Server* を選択します。

サーバーのアドレスを貼り付けてください。

![](/img/{{ site.lang }}/minecraft_be/step_ingame.png)

なお、サーバーのアドレスは OwnServer client を起動するたびに変更されることに注意してください。

## 免責事項
```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

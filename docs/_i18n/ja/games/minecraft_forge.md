# Minecraft Forge のサーバーを用意する

## Java をインストールする
PowerShell を管理者権限で開き、以下のコマンドを実行して Java (OpenJDK) をインストールします

```
winget install Microsoft.OpenJDK.21
```

![](/img/{{ site.lang }}/minecraft_forge/install_java.png)

## Minecraft Forge をインストールする
https://files.minecraftforge.net/net/minecraftforge/forge/ から Forge のインストーラをダウンロードします。

`forge-<バージョン>-installer.jar` をダブルクリックして実行し、 `Install server` を実行します


![](/img/{{ site.lang }}/minecraft_forge/install_forge.png)

## Minecraft Forge サーバーを立ち上げる

OwnServer Client を起動して、 `Minecraft Forge` を選択して _次へ_ をクリックします
![](/img/{{ site.lang }}/minecraft_forge/step_selectgame.png)

_起動スクリプトを選択_ をクリックして、 Forge インストーラによって作られた `run.sh` または `run.bat` を探して開いてください。さらに _EULA に同意する_ にチェックをいれます。
次に、 _起動_ をクリックして Minecraft Forge サーバーを起動します。
セーブデータは `run.sh` または `run.bat` があるフォルダに作成されます。
![](/img/{{ site.lang }}/minecraft_forge/step_confgame_start.png)

しばらく待ち、 _ゲームサーバーを起動_ の状態が `実行中` であることを確認して _次へ_ をクリックします。
![](/img/{{ site.lang }}/minecraft_forge/step_confgame_next.png)

_起動_ をクリックすることで、あなたのパソコンで動いている Minecraft サーバーがインターネットに公開されます！
![](/img/{{ site.lang }}/minecraft_forge/step_tunnel_start.png)

_OwnServer を起動_ のステータスが _実行中_ であることを確認して、 _次へ_ を選択します。
![](/img/{{ site.lang }}/minecraft_forge/step_tunnel_next.png)

あなたの Minecraft サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/{{ site.lang }}/minecraft_forge/step_monitor.png)

## Minecraft サーバーに参加する

Minecraft を起動して、 *Multiplayer* -> *Add Server* を選択します。

サーバーのアドレスを貼り付けてください。
![](/img/{{ site.lang }}/minecraft/step_ingame.png)
なお、サーバーのアドレスは OwnServer client を起動するたびに変更されることに注意してください。

## 免責事項

```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

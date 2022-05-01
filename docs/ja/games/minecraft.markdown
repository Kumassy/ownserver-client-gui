---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Play Minecraft
---

# 免責事項
```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

# マインクラフトのサーバーをたてる
## Why Playhub
マインクラフトのオンラインプレイを楽しむには、サーバーを用意する必要があります。サーバーの構築方法にはいくつか考えられます

| 方法 | 価格 | 簡単さ | 拡張性 |
|:---|:---|:---|:---|:---|
| Realms | 🙂 | 😄 | 😢 |
| クラウド / VPS | 😢 | 🙂 | 😄 |
| 自宅サーバー | 😄 | 😢 | 😄 |

Realms は Minecraft が公式で用意しているサーバーです。導入が簡単で低価格ですが、 MOD が導入できないなどの制約があります。  
クラウド / VPS を使うと、 MOD の導入ができるなどの自由度が上がります。ただし、サーバーのスペックによっては高価になってしまうのと Linux サーバーの設定が必要で操作が難しいという欠点があります。  
自宅サーバーは価格と拡張性の点で優れていますが、インターネットに公開する設定が難しいです。グローバル IP アドレス、DDNS、ポート開放、ファイアウォールなどの設定が必要になることがあります。

PlayHub は

- 価格
- 簡単さ
- 拡張性

の 3 つに重点を置いて開発されています。 GUI を操作するだけの簡単操作で、自宅で動かしているサーバーをインターネットに公開し、すぐに友達とゲームで遊べるようになります！

## Minecraft サーバーを設定する
こちらの記事を参考にして、 `java` をパソコンにインストールしてください

> チュートリアル/サーバーのセットアップ  
> [https://minecraft.fandom.com/ja/wiki/チュートリアル/サーバーのセットアップ](https://minecraft.fandom.com/ja/wiki/%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB/%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)

デスクトップなどに、新しいフォルダを作成します。  
こちらの Web ページから `server.jar` をダウンロードして、先程作成したフォルダの中に配置します

> MINECRAFT: JAVA EDITIONのサーバーをダウンロードします  
> [https://www.minecraft.net/ja-jp/download/server](https://www.minecraft.net/ja-jp/download/server)


Playhub Client がインストールされていることを確認します。

Playhub Client を起動して、 `Minecraft` を選択して *NEXT* をクリックします
![](/img/minecraft/step_selectgame.png)

*SELECT FILE* をクリックして、先程ダウンロードした `server.jar` を探して開いてください。 `server.jar` へのパスが表示されるでしょう。次に、 *START* をクリックして Minecraft サーバーを起動します。
![](/img/minecraft/step_confgame_start.png)

*NEXT* をクリックします。
![](/img/minecraft/step_confgame_next.png)

*START* をクリックすることで、あなたのパソコンで動いている Minecraft サーバーがインターネットに公開されます！
![](/img/minecraft/step_tunnel_start.png)

*Launch tunnel* のステータスが *Running* であれば、インターネットに接続するための専用のトンネルが正しく構成できています。
![](/img/minecraft/step_tunnel_next.png)

あなたの Minecraft サーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/minecraft/step_monitor.png)

## Minecraft サーバーに参加する
Minecraft を起動して、 *Multiplayer* -> *Add Server* を選択します。

サーバーのアドレスを貼り付けてください。
![](/img/minecraft/step_ingame.png)
サーバーのアドレスは Playhub client を起動するたびに変更されることに注意してください。

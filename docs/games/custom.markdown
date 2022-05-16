---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

# layout: default
layout: pages
title: OwnServer を使って無料で任意のサービスをインターネットに公開する
---

# 任意のサービスをインターネットに公開する
OwnServer を使うと、 TCP を使う任意のサービスをインターネットに公開できます。ここでは例として、 Netcat のサーバーをインターネットに公開する方法を説明します。

## 事前準備
お使いのシステムに Netcat, `nc` コマンドがインストールされていない場合はインストールしておいてください。
また、 OwnServer Client がインストールされていることを確認してください。

## Netcat のサーバーをインターネットに公開する
OwnServer Client を起動して、 `カスタム設定` を選択して *次へ* をクリックします
![](/img/custom/step_selectgame.png)

*Local Server Executable Path* には任意のコマンドを実行します。例えば `echo hello` というコマンドを実行した場合、 OwnServer Client の内部では `sh -c 'echo hello'` というコマンドが実行されます。通常は Web サーバーの起動スクリプトなど、ローカルネットワークの何らかの TCP ポートを Listen するコマンドや実行ファイルを入力します。

*Local Port* には *Local Server Executable Path* に記述したコマンドや実行ファイルが Listen するポート番号を入力します。 OwnServer はインターネットからあなたの公開アドレスにリクエストがあると、 *Local Port* に記述したポート番号宛にリクエストを転送します。

ここでは `nc -kl 3010` というコマンドを実行して `localhost` の `3010/tcp` で Netcat の接続を待ち受けるように設定します。 *Local Port* には `3010` を指定します。
*Start* をクリックすると、 *Local Server Executable Path* に書いたコマンドや実行ファイルが実行されます。
![](/img/custom/step_confgame_start.png)

しばらく待ち、 *ゲームサーバーを起動* の状態が `Running` であることを確認して、 *次へ* をクリックします。
![](/img/custom/step_confgame_next.png)

*START* をクリックすることで、 OwnServer Client と OwnServer のサーバーの間でトンネルが構成されます。
![](/img/custom/step_tunnel_start.png)

*OwnServer を起動* のステータスが *Running* であることを確認して、 *次へ* を選択します。
![](/img/custom/step_tunnel_next.png)

あなたのサーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/custom/step_monitor.png)

## Netcat サーバーに接続する
Netcat クライアントを使ってインターネット経由で Netcat サーバーに接続してみましょう


## おわりに
今回は Netcat サーバーを公開しましたが、 Web サーバーなど他のサービスも公開できます。ぜひ試してみてください！

---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

# layout: default
layout: pages
title: OwnServer を使って無料で任意のサービスをインターネットに公開する

namespace: games/custom
permalink: /games/custom
permalink_ja: /games/custom
permalink_en: /games/custom
---

# 任意のサービスをインターネットに公開する
OwnServer を使うと、 TCP/UDP を使う任意のサービスをインターネットに公開できます。ここでは例として、 Netcat のサーバーをインターネットに公開する方法を説明します。

## 事前準備
お使いのシステムに Netcat, `nc` コマンドがインストールされていない場合はインストールしておいてください。
また、 OwnServer Client がインストールされていることを確認してください。

## Netcat のサーバーをインターネットに公開する
OwnServer Client を起動して、 `カスタム設定` を選択して *次へ* をクリックします
![](/img/custom/step_selectgame.png)

*サーバー起動コマンド* には任意のコマンドを実行します。例えば `echo hello` というコマンドを実行した場合、 OwnServer Client の内部では、 Linux/macOS の場合は `sh -c 'echo hello'` というコマンドが、 Windows の場合は `cmd /c 'echo hello'` というコマンドが実行されます。通常は Web サーバーの起動スクリプトなど、ローカルネットワークの何らかのポートを Listen するコマンドや実行ファイルを入力します。

*ポート* には *サーバー起動コマンド* に記述したコマンドや実行ファイルが Listen するポート番号を入力します。 OwnServer はインターネットからあなたの公開アドレスにリクエストがあると、 *ポート* に記述したポート番号宛にリクエストを転送します。

*プロトコル* は *サーバー起動コマンド* が利用するプロトコルを入力します。 TCP もしくは UDP のどちらかが選択できます。

ここでは `nc -kl 3010` というコマンドを実行して `localhost` の `3010/tcp` で Netcat の接続を待ち受けるように設定します。 *ポート* には `3010` を指定します。
*起動* をクリックすると、 *サーバー起動コマンド* に書いたコマンドや実行ファイルが実行されます。
![](/img/custom/step_confgame_start.png)

しばらく待ち、 *コマンドを実行* の状態が `実行中` であることを確認して、 *次へ* をクリックします。
![](/img/custom/step_confgame_next.png)

*起動* をクリックすることで、 OwnServer Client と OwnServer のサーバーの間でトンネルが構成されます。
![](/img/custom/step_tunnel_start.png)

*OwnServer を起動* のステータスが *実行中* であることを確認して、 *次へ* を選択します。
![](/img/custom/step_tunnel_next.png)

あなたのサーバーに接続するためのアドレスが確認できます。これを友達に共有しましょう！
![](/img/custom/step_monitor.png)

## Netcat サーバーに接続する
Netcat クライアントを使ってインターネット経由で Netcat サーバーに接続してみましょう


## おわりに
今回は Netcat サーバーを公開しましたが、 Web サーバーなど他のサービスも公開できます。ぜひ試してみてください！

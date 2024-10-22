# Hosting Minecraft Server (Bedrock Edition)

The following pages explain how to run the server on Windows.

## Prerequisite
Download and extract the zip file containing bedrock_server.exe from the following page:

> Minecraft Bedrock Server Download | Minecraft  
> [https://www.minecraft.net/en-us/download/server/bedrock](https://www.minecraft.net/en-us/download/server/bedrock)
{: .blockquote }

Ensure that OwnServer Client is installed.

Open a command prompt with administrator privileges and execute the following command

> 
> CheckNetIsolation.exe LoopbackExempt –a –p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436

![](/img/{{ site.lang }}/minecraft_be/configure_loopback.png)

## Publish your Minecraft server to the Internet
Start OwnServer Client, select `Minecraft Bedrock Edition` and click *Next*.  

![](/img/{{ site.lang }}/minecraft_be/step_selectgame.png)

Click *SELECT bedrock_server.exe* and open the `bedrock_server.exe` you just downloaded.
Next, click *Start* to launch the Minecraft server.
Saved data will be created in the folder containing `bedrock_server.exe`.

![](/img/{{ site.lang }}/minecraft_be/step_confgame_start.png)

Wait a moment, make sure that the status of *Start Game Server* is `Running` and click *Next*.

![](/img/{{ site.lang }}/minecraft_be/step_confgame_next.png)

Clicking *Start* will expose the Minecraft server running on your computer to the Internet!

![](/img/{{ site.lang }}/minecraft_be/step_tunnel_start.png)

Verify that the status of *Start OwnServer* is *Running* and select *Next*.

![](/img/{{ site.lang }}/minecraft_be/step_tunnel_next.png)

You can see the public address of your Minecraft server. Share this with your friends!

![](/img/{{ site.lang }}/minecraft_be/step_monitor.png)

## Join the Minecraft server
Start Minecraft and select *Multiplayer* -> *Add Server*.

Paste the server address.

![](/img/{{ site.lang }}/minecraft_be/step_ingame.png)

Note that the server address changes each time the OwnServer client is started.

## 免責事項
```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

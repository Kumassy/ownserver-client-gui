---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Play Minecraft
---

# DISCLAIMER
```
NOT OFFICIAL MINECRAFT PRODUCT.NOT APPROVED BY OR ASSOCIATED WITH MOJANG
```

# Play Minecraft
## Why Playhub
You must prepare a server to enjoy Minecraft with your friends. There are several ways to achieve this:

| method | price | difficulty | extensibility |
|:---|:---|:---|:---|:---|
| Realms | 🙂 | 😄 | 😢 |
| Cloud / VPS | 😢 | 🙂 | 😄 |
| Home Server | 😄 | 😢 | 😄 |

Realms is an official Minecraft server. It is easy to install and affordable, but have limitations such as not being able to install mods.  
Using a cloud/VPS server gives you more flexibility, allows you to install mods. However, they are more expensive depending on the server specs and hassle to set up: you'll need to configure Linux servers.  
Home servers are superior in terms of price and scalability, but are difficult to configure to publish to the Internet. Global IP addresses, DDNS, open ports, firewalls, and other settings may be required.

Playhub has developed to achieve three goals: affordability, ease of use, and extensibility.
With a simple GUI operation, you can publish your home server to the Internet and start playing games with your friends right away!

## Configure Minecraft Server
Please refer to this guide to install `java` on your computer.

> Tutorials/Setting up a server  
> [https://minecraft.fandom.com/wiki/Tutorials/Setting_up_a_server](https://minecraft.fandom.com/wiki/Tutorials/Setting_up_a_server)

Create a new folder on your Desktop (or elsewhere).
Download `server.jar` from this page and place it inside the folder you created.

> DOWNLOAD THE MINECRAFT: JAVA EDITION SERVER  
> [https://www.minecraft.net/en-us/download/server](https://www.minecraft.net/en-us/download/server)


Please make sure Playhub GUI is installed.

Start Playhub Client.
Select Minecraft and click *NEXT*.
![](../img/minecraft/step_selectgame.png)

Click *SELECT FILE* and open the `server.jar` file you have just downloaded. You will see the path to `server.jar`. Then, click *START* to launch Minecraft Server.
![](../img/minecraft/step_confgame_start.png)

Tap *NEXT*.
![](../img/minecraft/step_confgame_next.png)

Clicking Start will publish your game server to the Internet!
![](../img/minecraft/step_tunnel_start.png)

If *Launch tunnel* status is *Running*, the tunnel is successfully configured.
![](../img/minecraft/step_tunnel_next.png)

You can check your public address here. Don't forget to share with your friends!
![](../img/minecraft/step_monitor.png)

## Join Minecraft Server
Start Minecraft and go to *Multiplayer* -> *Add Server*.

Paste Server Address like this:
![](../img/minecraft/step_ingame.png)
Note that your address changes every time you start PlayHub client.

# Publish any service to the Internet 
OwnServer allows you to publish any service that uses TCP/UDP to the Internet. Here is an example of how to publish a Netcat server to the Internet.

## Prerequisite
Make sure you have the Netcat, `nc` command installed on your system.
Also, ensure that the OwnServer Client is installed.

## Publish your Netcat server to the Internet
Start OwnServer Client, select `Custom` and click *Next*.
![](/img/{{ site.lang }}/custom/step_selectgame.png)

Put any command to *Server Startup Command*. 
For example, if you set the command `echo hello`, the OwnServer Client will execute the command `sh -c 'echo hello'` on Linux/macOS or `cmd /c 'echo hello'` on Windows.
Usually, you will enter a command or executable file that listens on some port of the local network, such as a script to start a web server.

Enter the *Port* number to which the commands and executables described in the *Server Startup Command* will listen.
When a request comes in from the Internet to your public address, OwnServer will forward the request to the port number in the *Port* field.

*Protocol* is the protocol to be used by the *Server Startup Command*. You can choose either TCP or UDP.

We will run the command `nc -kl 3010` to listen for Netcat connections on `3010/tcp` on `localhost`. Specify `3010` for *Port*.
Click *Start* to run the commands specified in the *Server Startup Commands*.
![](/img/{{ site.lang }}/custom/step_confgame_start.png)

Wait a moment, make sure that the status of *Start Game Server* is `Running` and click *Next*.
![](/img/{{ site.lang }}/custom/step_confgame_next.png)

Clicking *Start* will configure a tunnel between your OwnServer Client and the public address.
![](/img/{{ site.lang }}/custom/step_tunnel_start.png)

Verify that the status of *Start OwnServer* is *Running* and select *Next*.
![](/img/{{ site.lang }}/custom/step_tunnel_next.png)

You can see the public address of your Minecraft server. Share this with your friends!
![](/img/{{ site.lang }}/custom/step_monitor.png)

## Connect to the Netcat server
Connect to your Netcat server via the Internet with a Netcat client


## Conclusion
You can publish any service like a web server as well.
Have a try!

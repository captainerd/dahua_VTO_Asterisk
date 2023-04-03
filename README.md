# dahua_VTO_Asterisk
How to connect a VTO of Dahua to Asterisk

In order to be able to succesfully use DAHUA's VTH monitors AND at the same time use FreePBX / Asterisk and reach full compatibility where all VTH's works with VTO
rfid tags, etc etc.. and at the same time phones that are connected into Asterisk. You need to set VTO as a "server" ignore that asterisk exists in your 
configuration and just make sure ext numbers doesn't conflict. connect all VTH's monitors etc.. directly to VTO as you normaly would.. set up everything

Then back to Asterisk you create a PJSIP Trunk and the appropiate inbound/outbound routes. In Dahua web you add your "Trunk" as a VTS with your password, for example 1011 

![image](https://user-images.githubusercontent.com/58100748/229393915-75d5d4c2-0455-4a89-be24-6a300234be60.png)

Then you add a Trunk into Asterisk for VTO IP's in the PJSIP Advanced settings you set the following: DTMF Mode = info, contact user = Your VTS number. Message Context: 1011
eg 1011 you will use that later in inbound routes as the DID number in order to create the route.

![image](https://user-images.githubusercontent.com/58100748/229394191-f3fb6c22-a49d-4867-a606-dd937c365714.png)

![image](https://user-images.githubusercontent.com/58100748/229394401-b200e3fc-cf13-4824-8db2-efd2748cea3a.png)

This way setting in VTO web as "Villa call no:" the Trunk no, or adding it into Group call. it will be routed through your Trunk. However you won't be able to call VTO
from Asterisk unless you run the node proxy i uploaded here, in that case your trunks ip will be the proxy's IP. this way you can both outgoing calls from asterisk to VTO
where you can talk to VTO or incoming calls from VTO To you. 

You need to run "node dahua_proxy.js"  proxy script as a background service or something in that case, to ensure it will always be running with asterisk. dahua_proxy.js just take cares Asterisk won't be dropping outgoing calls from your route by taking care of the compatible codec offering order.

#Secondly:

I provide you for Asterisk/FreeBPX an example of sets AGI-script + dialplan, on how to create an "unlock" phone number for asterisk, 
where you call that no, and it unlocks the door.

Thats all folks.

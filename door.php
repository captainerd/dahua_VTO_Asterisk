
#!/usr/bin/env php
<?php

//place that at path: /var/lib/asterisk/agi-bin
//Edit the IP of your VTO 

//for FreePBX edit the file at: /etc/asterisk/extensions_custom.conf and add:
//these two lines:
//[from-internal-custom]
//exten => 5001,1,AGI(door1.php,${CALLERID(number)})
//do a reload after the edits. make sure door.php has correct permissions. 


$VTO = "192.168.1.101";


require('phpagi.php');
$agi = new AGI();
$agi->answer();
$agi->stream_file("beep","#");

$sss = file_get_contents2("http://".$VTO."/cgi-bin/accessControl.cgi?action=openDoor&channel=1&UserID=" . rand() . "&Type=Remote");


$agi->stream_file("open","#");

$agi->hangup();

//$agi->hangup();
function file_get_contents2($url) {
  $command = "curl --user admin:prosvasi10 --digest '" . $url . "'";
  $content = shell_exec($command);
  return $content;
}

 
 


?>

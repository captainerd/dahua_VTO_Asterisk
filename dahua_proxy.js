//Script to act as a proxy in order to enable PJSIP calls to Dahua VTO (tested with VTO6210B ) 
//This will act as your Trunk for Asterisk.  

const dgram = require('dgram');

//Port for dahua VTO and IP 
const IP_TO_FORWARD = '192.168.6.107';
const PORT_TO_FORWARD = 5060;

//This is should be the same server that runs Asterisk it self.
const ASTERISK_IP = "192.168.7.2";
const ASTERISK_PORT = 5060;

//Port for your Trunk.
const IP_TO_LISTEN = '0.0.0.0'; // Listen on all available network interfaces
const PORT_TO_LISTEN = 5669;


try {
const { execSync } = require('child_process');

// Find PID of process listening on port 5669
const output = execSync('lsof -i :5669 -t').toString().trim();
if (output) {
  const pid = parseInt(output, 10);
  // Kill process with SIGKILL signal
  process.kill(pid, 'SIGKILL');
  console.log(`Killed process ${pid}`);
} else {
  console.log('No process found listening on port 5669');
}
} catch(error) {
}

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  // Log incoming message
  console.log(`Incoming message from ${rinfo.address}:${rinfo.port}: ${msg.toString()}`);

  // Forward message to new IP

 if (rinfo.address !== IP_TO_FORWARD) {

  server.send(msg, 0, msg.length, PORT_TO_FORWARD, IP_TO_FORWARD, (err) => {
    if (err) {
      console.error(`Error sending message to ${IP_TO_FORWARD}:${PORT_TO_FORWARD}:`, err);
    } else {
      // Log outgoing message
      console.log(`Outgoing message to ${IP_TO_FORWARD}:${PORT_TO_FORWARD}: ${msg.toString()}`);
    }
  });
} else {
    // Message is from VTO, log it to console for client and send it to Asterisk
//    console.log(`Incoming message from VTO: ${msg.toString()}`);
const messageString = msg.toString();

const h264Offering = 'm=video 20001 RTP/AVP 96\r\na=framerate:25.000000\r\na=rtpmap:96 H264/90000\r\na=sendrecv\r\n';
const modifiedMessageString = messageString.replace(/m=video[\s\S]+?a=rtpmap:96 H264\/90000[\s\S]+?(\r\n|$)/, '');

const newMessageString = modifiedMessageString + h264Offering;
const newMessageBuffer = Buffer.from(newMessageString);

 console.log(`Incoming message (reversed?) from VTO: ${newMessageBuffer.toString()}`);
    server.send(newMessageBuffer, 0, newMessageBuffer.length, ASTERISK_PORT, ASTERISK_IP, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});
server.on('error', (err) => {
  console.error('Error:', err);
});

server.bind(PORT_TO_LISTEN, IP_TO_LISTEN, () => {
  console.log(`UDP proxy listening on ${IP_TO_LISTEN}:${PORT_TO_LISTEN}`);
});

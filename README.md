Arduino RC Switch
=================

This Arduino project uses an ethernet shield with a WebSocket server implementation to operate low cost 
315 MHz / 433 MHz remote control devices (e.g. power outlet sockets) with a web client. A mobile phone 
client written with PhoneGap and jQuery Mobile is included (currently for Android).


Requirements
============

Hardware:
- Arduino (tested with Arduino Uno and Arduino Leonardo)
- Arduino Ethernet Shield
- a 315/433MHz AM transmitter

Arduino libraries:
- rc-switch Arduino library: https://code.google.com/p/rc-switch
- Websocket Server for Arduino: https://github.com/ejeklint/ArduinoWebsocketServer

Mobile client:
- Android SDK
- Node.js: http://www.nodejs.org/
- Phonegap: http://www.phonegap.com
- (optional) Aptana Studio to open the mobile client workspace: http://www.aptana.com


Installation
============

Arduino:
- Install the rc-switch and Websocket libraries into the "libraries" folder of your Arduino IDE
- Load the "ArduinoWsServer.ino" into the Arduino IDE, change the IP address (if necessary) 
- Compile the file and program the Arduino

Mobile client:
- Install the Android SDK
- Install the Node.js Javascript runtime
- Install Phonegap
- Go to the "RCSwitchMobileClient" folder and compile the Android app with "phonegap build android"
- The compile APK will be compiled to "platforms/android/ant-build"
- Install the APK on your mobile phone

For more information on how to use Phonegap or the Android SDK please refer to the Phonegap documentation.


Known bugs / ToDos
==================

- After running for several days, the Arduino needs to be restarted
- Type B and C are currently not implemented in the mobile client
- Some Android versions seem to have a faulty Websocket client implementation
- Internationalisation of the mobile client (currently only german)
- The "Desktop Client" is mainly just a very simple test on how to use a websocket to control the Arduino


Help
====

Your help is highly appreciated in any way (graphics, code clean up, other clients, ...). Just fork the 
repository and send a pull-request after your changes.


License
=======

This project is provided under the MIT license. See LICENSE.md for more information.


(c)2014 Tim "Octoate" Riemann
# Tessel Wifi Setup [WIP]

[![Greenkeeper badge](https://badges.greenkeeper.io/reconbot/tessel-wifi-setup.svg)](https://greenkeeper.io/)

This is (or will be) an NPM package to run inside a Tessel program for helping users connect Tessel to a local wifi network through a custom access point and web app. 

## Installation (once it's been published)

```
npm install tessel-wifi-setup --save
```

## Usage (eventually)

```js
var TesselWifiSetup = require('tessel-wifi-setup');

var session = TesselWifiSetup.start();

session.on('complete', function (wirelessConfig) {
  console.log('Tessel is now connected to the %s network', wirelessConfig.ssid);
});

session.on('cancel', function () {
  console.log('The session was canceled, so the Tessel is not connected to wifi.');
});

// OR

var TesselWifiSetup = require('tessel-wifi-setup');

TesselWifiSetup.start(function (error, config) {
  if (error) {
    console.log('The user is not connected');
  } else {
    console.log('The session was canceled, so the Tessel is not connected to wifi.');
  }
});
```

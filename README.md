# Tessel Wifi Setup

This is (or will be) an NPM package to run inside a Tessel program for helping users connect Tessel to a local wifi network through a custom access point and web app. 

## Installation

```
npm install tessel-wifi-setup --save
```

## Usage

```js
var TesselWifiSetup = require('tessel-wifi-setup');

TesselWifiSetup.start();

TesselWifiSetup.on('complete', function () {
  console.log('Tessel is now connected to wifi!');
});
```

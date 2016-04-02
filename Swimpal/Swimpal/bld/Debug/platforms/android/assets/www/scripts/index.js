// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.



'use strict';

var bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

var app =  {

     initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;

     },

    bindEvents : function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        disconnectButton.addEventListener('touchstart', this.disconnect);
        sendButton.addEventListener('touchstart', this.sendData);
        deviceList.addEventListener('touchstart', this.connect, false);
    },

    onDeviceReady: function() {

        app.refreshDeviceList();
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    },
   

    refreshDeviceList: function() {
        deviceList.innerHTML = '';
        if (cordova.platformId === 'android') {
            ble.scan([], 5, app.onDiscoverDevice, app.onError);
        }
    },

    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li');
        var html = '<b>' + device.name + '</b><br/>' +
            'RSSI: ' + device.rssi + '<br/>' + 
            'ID: ' + device.id;

        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },

    connect: function(e) {
        var deviceId = e.target.dataset.deviceId;

        var onConnect = function(peripheral) {
            //app.determineWriteType(peripheral);

            
            ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
            var name = peripheral.name;
            var service = peripheral.services;

            console.log("Peripheral is connected: " + name + "<br/>" + service);

            sendButton.dataset.deviceId = deviceId;
            disconnectButton.dataset.deviceId = deviceId;
            resultDiv.innerHTML = "";
            app.showDetailPage();
        };

        ble.connect(deviceId, onConnect, app.onError);
    },

    determineWriteType: function (peripheral) {
        // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
        // Newer Bluefruit devices use Write Request for the TX characteristic

        var characteristic = peripheral.characteristics.filter(function (element) {
            if (element.characteristic.toLowerCase() === bluefruit.txCharacteristic) {
                return element;
            }
        })[0];

        if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
            app.writeWithoutResponse = true;
        } else {
            app.writeWithoutResponse = false;
        }

    },

    onData: function (data) { // data received from Arduino
        //console.log(bytesToString(data));
        //resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        //resultDiv.scrollTop = resultDiv.scrollHeight;
    },

    sendData: function (event) { // send data to Arduino

        var success = function () {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function () {
            alert("Failed writing data to the bluefruit le");
        };

        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;

        
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                data, success, failure
            );
        

    },

    disconnect: function (event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },

    showMainPage: function () {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },

    showDetailPage: function () {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    

    onError: function(reason) {
        alert("Error: " + reason);
    }

    
};
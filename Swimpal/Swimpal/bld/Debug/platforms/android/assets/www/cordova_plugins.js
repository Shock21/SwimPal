cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.bluetooth/www/bluetooth.js",
        "id": "com.phonegap.plugins.bluetooth.bluetooth",
        "clobbers": [
            "bluetooth"
        ]
    },
    {
        "file": "plugins/cordova-plugin-ble-central/www/ble.js",
        "id": "cordova-plugin-ble-central.ble",
        "clobbers": [
            "ble"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.bluetooth": "0.9",
    "cordova-plugin-ble-central": "1.0.4"
}
// BOTTOM OF METADATA
});
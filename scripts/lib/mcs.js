const MCS = require('sf-extension-mcs');
var options = {
	'backendId': '29c84b1c-8456-4a2e-894c-bbb22b98e1f7', //required
	'baseUrl': 'https://smartface-mobilebel.mobileenv.em2.oraclecloud.com:443', //required
	'androidApplicationKey': '4131c13d-f41e-4efa-84ee-e03063f55ae9', //required only for analytics & events
	'iOSApplicationKey': 'd4068814-7885-457a-b069-80ff3296fc85', //required only for analytics & events
	'anonymousKey': 'TU9CSUxFQkVMX1NNQVJURkFDRV9NT0JJTEVfQU5PTllNT1VTX0FQUElEOmZzOXEzakltbm9iX2hw' //required only to perform operations without logging in first
};
var mcs = new MCS(options);

module.exports = exports = mcs;
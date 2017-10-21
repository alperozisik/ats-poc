const MCS = require('sf-extension-mcs');
var options = {
	'backendId': '29c84b1c-8456-4a2e-894c-bbb22b98e1f7', //required
	'baseUrl': 'https://smartface-mobilebel.mobileenv.em2.oraclecloud.com:443', //required
	'androidApplicationKey': '2813cac6-ee4b-4f75-b229-810cdb4748b5', //required only for analytics & events
	'iOSApplicationKey': '6161d06a-acc5-486d-852e-0f808c1d6a56', //required only for analytics & events
	'anonymousKey': 'TU9CSUxFQkVMX1NNQVJURkFDRV9NT0JJTEVfQU5PTllNT1VTX0FQUElEOmZzOXEzakltbm9iX2hw' //required only to perform operations without logging in first
};
var mcs = new MCS(options);

module.exports = exports = mcs;
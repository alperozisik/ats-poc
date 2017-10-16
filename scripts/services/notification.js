const Notifications = require("sf-core/notifications");
var recentToken = null;

Object.assign(exports, {
    getMostRecentToken,
    getToken
});

/**
 * uses existing token value or requests for a new one
 */
function getMostRecentToken() {
    if (!recentToken) {
        return new Promise((resolve, reject) => {
            resolve(recentToken);
        });
    }
    else {
        return getToken();
    }
}

/**
 * makes a new request for token
 */
function getToken() {
    return new Promise((resolve, reject) => {
        Notifications.registerForPushNotifications(function(e) {
            recentToken = e.token;
            resolve(e.token);
        }, function() {
            reject("null");
        });
    });
}

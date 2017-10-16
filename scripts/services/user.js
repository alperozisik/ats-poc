const serviceCall = require("./lib/service-call");
const System = require('sf-core/device/system');
const notificationService = require("./notification");
Object.assign(exports, {
    login
});
const deviceCode = System.OS === "iOS" ? 1 : 2;
const companyId = 1;

function login(nickname, password) {
    return new Promise((resolve, reject) => {

        nickname = encodeURIComponent(nickname);
        password = encodeURIComponent(password);
        var tokenId = "null";

        notificationService.getMostRecentToken().then((token) => {
            tokenId = token;
            callService(nickname, password, tokenId, resolve, reject);
        }).catch((token) => {
            tokenId = token;
            callService(nickname, password, tokenId, resolve, reject);
        });

    });

    function callService(nickname, password, tokenId, resolve, reject) {
        serviceCall.request({
            path: `/loginWS/login/${companyId}/${password}/${nickname}/${tokenId}/${deviceCode}`
        }).then((userInfo) => {
            resolve(userInfo);
        }).catch((err) => {
            reject(err);
        });
    }
}

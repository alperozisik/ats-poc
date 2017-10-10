const serviceCall = require("./lib/service-call");
const System = require('sf-core/device/system');

Object.assign(exports, {
    login
});


function login(nickname, password) {
    const deviceCode = System.OS === "iOS" ? 1 : 2;
    const tokenId = "IdoNotKnow";
    const companyId = 1;

    return serviceCall.request({
        path: `loginWS/login/${companyId}/${password}/${nickname}/${tokenId}/${deviceCode}`
    });
}

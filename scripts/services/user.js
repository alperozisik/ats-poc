var serviceCall = require("./lib/service-call");
const request = serviceCall.request;
const mcs = require("../lib/mcs");
const System = require('sf-core/device/system');

Object.assign(exports, {
    login
});
const deviceType = System.OS;

function login(username, password) {
    return new Promise((resolve, reject) => {
        mcs.login({ username: "ats", password: "123qweASD" }, function(err) {
            if (err)
                reject(err);
            else {
                mcs.registerDeviceToken({ packageName: "io.smartface.ats", version: "1.0.0" }, function(err, result) {
                    var reqOps = serviceCall.createRequestOptions(`patient/login`, {
                        method: "POST",
                        body: {
                            username,
                            password,
                            deviceType
                        }
                    });
                    if (!err)
                        reqOps.notificationToken = result.notificationToken;
                    request(reqOps).then((result) => {
                        resolve(result.patientId);
                    }).catch((err) => {
                        reject(err);
                    });

                });
            }
        });

    });
}

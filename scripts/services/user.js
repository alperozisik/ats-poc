var serviceCall = require("./lib/service-call");
const request = serviceCall.request;
const mcs = require("../lib/mcs");
const System = require('sf-core/device/system');
const appData = require("../lib/appData");

Object.assign(exports, {
    login,
    getTimeline
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
                    if (!err) {
                        reqOps.notificationToken = result.notificationToken;
                        appData.notificationToken = result.notificationToken;
                    }
                    request(reqOps).then((result) => {
                        appData.patientId = result.patientId;
                        resolve(result.patientId);
                    }).catch((err) => {
                        reject(err);
                    });

                });
            }
        });

    });
}

function getTimeline(page = 1) {
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`patient/${appData.patientId}/timeline?page=${page}`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

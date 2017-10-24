var serviceCall = require("./lib/service-call");
const request = serviceCall.request;
//const mcs = require("../lib/mcs");
const appData = require("../lib/appData");

Object.assign(exports, {
    getAppointmentCount,
    getSlotTime,
    bookAppointment
});


function getAppointmentCount(clinicNo, doctorId, year, month) {
    var yearMonth = `${year}-${month}`;

    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`appointment/available/${clinicNo}/${doctorId}/${yearMonth}`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getSlotTime(doctorId, period, date) {
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`appointment/${doctorId}/${period}/${date}`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            var data = {
                full: result,
                texts: []
            };
            result.forEach(item => data.texts.push(`${item.slotTimeFrom}-${item.slotTimeTo} (${item.periodDesc})`));
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function bookAppointment(doctorId, slotSerial, categorycode) {
    var patientId = appData.patientId;

    var body = {
        doctorId,
        slotSerial,
        categorycode,
        patientId
    };
    
    if(appData.notificationToken)
        body.notificationToken = appData.notificationToken;

    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`appointment`, {
            method: "POST",
            body
        });
        request(reqOps).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

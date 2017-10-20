var serviceCall = require("./lib/service-call");
const request = serviceCall.request;
//const mcs = require("../lib/mcs");
//const appData = require("../lib/appData");

Object.assign(exports, {
    getClinic,
    getDoctorOfDepartments,
    getAppointmentsCategories,
    getAppointmentsPeriods
});


function getClinic(contextData) {
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`clinic`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            var data = {
                full: result,
                texts: []
            };
            result.forEach(item => data.texts.push(item.clinicDesc));
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getDoctorOfDepartments(contextData) {
    var clinicNo = contextData[0].clinicNo;
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`clinic/${clinicNo}/doctors`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            var data = {
                full: result,
                texts: []
            };
            result.forEach(item => data.texts.push(item.doctorName));
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getAppointmentsCategories(contextData) {
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`appointment/category`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            var data = {
                full: result,
                texts: []
            };
            result.forEach(item => data.texts.push(item.categoryDesc));
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getAppointmentsPeriods(contextData) {
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`appointment/period`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            var data = {
                full: result,
                texts: []
            };
            result.forEach(item => data.texts.push(item.periodDesc));
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}



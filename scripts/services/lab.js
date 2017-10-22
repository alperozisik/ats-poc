const serviceCall = require("./lib/service-call");
const request = serviceCall.request;

Object.assign(exports, {
    getLabResults
});


function getLabResults(orderNo) {
    return new Promise((resolve, reject) => {
        var reqOps = serviceCall.createRequestOptions(`lab/results/${orderNo}`, {
            method: "GET"
        });
        request(reqOps).then((result) => {
            resolve(result);
            //resolve([{ "testId": "51476", "testName": "CULTURE&SENSITIVITY GENITAL FEMALE", "result": 10, "isDetailed": "1", "resultDetails": "NORMAL VAGINAL FLORA ,GROWTH RATE: Scanty growth of, COLONY COUNT: 10^3 CFU/ml of\n", "isGroup": "0", "unitName": null, "normalRange": null, "nrMin": null, "nrMax": null, "resultDateG": "27-03-2010 00:00", "resultDateH": "11-04-1431 00:00", "companyId": "1", "patientType": "2", "patientId": "21212", "admissionNo": null, "opdSectionNo": "483", "opdSerialNo": "126841", "orderNo": "4046866", "sectionNo": "483", "specimenNo": "1262507", "ordSequenceNo": "24358662", "isHigh": "0", "isLow": "0", "groupItem": "51476", "status": "Available" }]);
        }).catch((err) => {
            reject(err);
        });
    });
}

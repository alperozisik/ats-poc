/*globals Device */
const Http = require("sf-core/net/http");
const http = new Http();
const mixinDeep = require('mixin-deep');
const mcs = require("../../lib/mcs");
const Base64_Helper = require("../../lib/base64");
const Base64 = new Base64_Helper();
//const System = require('sf-core/device/system');
var lang = Device.language; //System.language.subStr(0, 2);
lang = lang === "ar" ? "ar" : "en";
const commonHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "Accept": "application/json; charset=utf-8",
    "language": lang
};
const methodsWithoutBody = ["GET", "HEAD"];

Object.assign(exports, {
    request,
    setCommonHeaderValue,
    createRequestOptions,
});

function setCommonHeaderValue(key, value) {
    if (typeof key === "object") {
        for (let k in key) {
            let v = key[k];
            setCommonHeaderValue(k, v);
        }
    }
    else if (typeof key === "string") {
        if (value) {
            commonHeaders[key] = String(value);
        }
        else
            delete commonHeaders[key];
    }
    else
        throw Error("key must be string or object");
}

function createRequestOptions(endpointPath, options) {
    var mcsRequestOptions = mcs.createRequestOptions({
        apiName: "ats",
        endpointPath
    });
    var requestOptions = mixinDeep(mcsRequestOptions, {
        headers: commonHeaders
    }, options || {});
    return requestOptions;
}


function request(options) {
    return new Promise((resolve, reject) => {
        var requestOptions = mixinDeep({
            onLoad: function(response) {
                try {
                    bodyParser(response);
                    resolve(response.body);
                }
                catch (ex) {
                    reject(ex);
                }
            },
            onError: function(e) {
                e.headers = e.headers || {};
                e.body = e.body || "";
                bodyParser(e);
                reject(e);
            }
        }, options);
        if (methodsWithoutBody.indexOf(requestOptions.method) !== -1) {
            if (requestOptions.body) {
                delete requestOptions.body;
            }
            if (requestOptions.headers["Content-Type"])
                delete requestOptions.headers["Content-Type"];
        }
        else {
            if (requestOptions.body && typeof requestOptions.body === "object" &&
                requestOptions.headers["Content-Type"].startsWith("application/json")) {
                requestOptions.body = JSON.stringify(requestOptions.body);
            }
        }




        console.log(`request: ${JSON.stringify(requestOptions)}`);
        http.request(requestOptions);
    });
}


function bodyParser(response) {
    const contentType = getContentType(response.headers);
    switch (true) {
        case !contentType.startsWith("image"):
            response.body = Base64.decode(response.body.toBase64());
            console.log(`body = ${response.body}`);
        case contentType === "application/json":
            try {
                response.body = JSON.parse(response.body);
            }
            catch (ex) {}
            break;
    }
}

function getContentType(headers = {}) {
    var contentType = headers["Content-Type"];
    if (!contentType) {
        let headers = Object.keys(headers);
        for (let i in headers) {
            let h = headers[i];
            if (h.toLowerCase() === "content-type") {
                contentType = headers[h];
                break;
            }
        }
    }
    return contentType;
}

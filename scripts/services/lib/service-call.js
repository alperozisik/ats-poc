/*globals Device */
const Http = require("sf-core/net/http");
const http = new Http();
const mixinDeep = require('mixin-deep');
const mcs = require("../../lib/mcs");
//const System = require('sf-core/device/system');
var lang =  Device.language;//System.language.subStr(0, 2);
lang = lang === "ar" ? "ar" : "en";
const commonHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
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
            response.body = response.body.toString();
            console.log(`body = ${response.body}`);
            response.body = response.body || "{}";
        case contentType === "application/json":
            response.body = JSON.parse(response.body);
            break;
    }
}

function getContentType(headers) {
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

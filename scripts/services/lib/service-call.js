const Http = require("sf-core/net/http");
const http = new Http();
const mixinDeep = require('mixin-deep');
const commonHeaders = {
    "Accept": "application/json",
    "Authorization": "Basic YXRzOmNhcmV3YXJlMTIz",
};
const baseUrl = "http://46.44.115.43:8989/careware/resources";

Object.assign(exports, {
    request,
    setCommonHeaderValue
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


function request(options) {
    return new Promise((resolve, reject) => {
        var requestOptions = mixinDeep({
            url: baseUrl + options.path,
            headers: commonHeaders,
            method: "GET",
            onLoad: function(response) {
                try {
                    bodyParser(response);
                    if (typeof response.body.result === "string")
                        response.body.result = parseInt(response.body.result, 10);
                    if (response.body.result)
                        resolve(response.body);
                    else
                        reject(response.body);
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

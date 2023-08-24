"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
var MeSomb_1 = require("./MeSomb");
var Signature = /** @class */ (function () {
    function Signature() {
    }
    Signature.signRequest = function (service, method, url, date, nonce, credentials, headers, body) {
        if (headers === void 0) { headers = {}; }
        var algorithm = MeSomb_1.default.ALGORITHM;
        var parse = new URL(url);
        var canonicalQuery = parse.searchParams.toString();
        var timestamp = date.getTime();
        headers.host = "".concat(parse.protocol, "//").concat(parse.host);
        headers['x-mesomb-date'] = String(timestamp);
        headers['x-mesomb-nonce'] = nonce;
        var headersKeys = Object.keys(headers).sort();
        var canonicalHeaders = headersKeys.map(function (key) { return "".concat(key, ":").concat(headers[key]); }).join('\n');
        var CryptoJS = require('crypto-js');
        var payloadHash = CryptoJS.SHA1(body ? JSON.stringify(body) : '{}').toString();
        var signedHeaders = headersKeys.join(';');
        var path = encodeURI(parse.pathname);
        var canonicalRequest = "".concat(method, "\n").concat(path, "\n").concat(canonicalQuery, "\n").concat(canonicalHeaders, "\n").concat(signedHeaders, "\n").concat(payloadHash);
        var scope = "".concat(date.getFullYear()).concat(date.getMonth()).concat(date.getDate(), "/").concat(service, "/mesomb_request");
        var stringToSign = "".concat(algorithm, "\n").concat(timestamp, "\n").concat(scope, "\n").concat(CryptoJS.SHA1(canonicalRequest).toString());
        var signature = CryptoJS.HmacSHA1(stringToSign, credentials.secretKey).toString();
        return "".concat(algorithm, " Credential=").concat(credentials.accessKey, "/").concat(scope, ", SignedHeaders=").concat(signedHeaders, ", Signature=").concat(signature);
    };
    return Signature;
}());
exports.Signature = Signature;

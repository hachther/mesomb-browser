import { MeSomb } from './MeSomb';
export class Signature {
    static signRequest(service, method, url, date, nonce, credentials, headers = {}, body) {
        const algorithm = MeSomb.ALGORITHM;
        const parse = new URL(url);
        const canonicalQuery = parse.searchParams.toString();
        const timestamp = date.getTime();
        headers['host'] = `${parse.protocol}//${parse.host}`;
        headers['x-mesomb-date'] = String(timestamp);
        headers['x-mesomb-nonce'] = nonce;
        const headersKeys = Object.keys(headers).sort();
        const canonicalHeaders = headersKeys.map((key) => `${key}:${headers[key]}`).join('\n');
        const CryptoJS = require('crypto-js');
        const payloadHash = CryptoJS.SHA1(body ? JSON.stringify(body) : '{}').toString();
        const signedHeaders = headersKeys.join(';');
        const path = encodeURI(parse.pathname);
        const canonicalRequest = `${method}\n${path}\n${canonicalQuery}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
        const scope = `${date.getFullYear()}${date.getMonth()}${date.getDate()}/${service}/mesomb_request`;
        const stringToSign = `${algorithm}\n${timestamp}\n${scope}\n${CryptoJS.SHA1(canonicalRequest).toString()}`;
        const signature = CryptoJS.HmacSHA1(stringToSign, credentials.secretKey).toString();
        return `${algorithm} Credential=${credentials.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }
}

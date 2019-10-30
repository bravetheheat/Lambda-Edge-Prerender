// AWS Lambda@Edge Origin Request
// Node 8.10

'use strict';
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;

    if (request.headers['x-prerender-token']) {
         const domainName = 'service.prerender.io';  // Or your Prerender.io-compatible server
         const host = request.headers['host']['value'];
            request.origin = {
                custom: {
                    domainName: domainName,
                    path: `/${host}`,
                    keepaliveTimeout: 5,
                    port: 443,
                    protocol: "https",
                    readTimeout: 20,
                    sslProtocols: [
                        "TLSv1.1",
                        "TLSv1.2"
                    ]

                }
            };
            request.headers['host'] = [{ key: 'host', value: domainName }];
    }
    
    /* Workaround for PWAs
    if (request.uri == '/index.html') {
        request.uri = '/'
    }
    */
    
    callback(null, request);
};

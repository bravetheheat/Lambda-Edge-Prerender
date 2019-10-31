// AWS Lambda@Edge Viewer Request
// Node 8.10

exports.handler = async (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const user_agent = headers['user-agent'];
    const host = headers['host'];
    const hostValue = host[0]['value'];

    if (user_agent && host) {
        // Check User Agent against list of crawlers
        var prerender = /Feedfetcher\-Google|bingbot|yandex|baiduspider|Facebot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/i.test(user_agent[0].value);
        prerender = prerender || /_escaped_fragment_/.test(request.querystring);
        
        /* Not needed if origin settings on Cloudfront have been set to only route *.html files to the lambda@edge function
        // Don't redirect requests for media or script files.
        prerender = prerender && !/\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)$/i.test(request.uri);
        */
        
        if (prerender) {
             // Set request header with Prerender API token
             request.headers['x-prerender-token']= [{ key: 'X-Prerender-Token', value:'Your Prerender.io API Token'}];
        }
    }
    callback(null, request);
};

function formatResponse(data, format) {
    if (format === 'xml') {
        return {
            type: 'application/xml',
            body: data
        };
    }
    return {
        type: 'application/json',
        body: data
    };
}

function wantsXml(req) {
    return req.headers['accept'] === 'application/xml' || req.query.format === 'xml';
}

module.exports = { formatResponse, wantsXml };
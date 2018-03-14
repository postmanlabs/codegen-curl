var sanitize = require('./util').sanitize,
    _ = require('lodash');

module.exports = {
    convert: function (request, options, callback) {

        var indent, trimOpt, headersData, body, text, redirect, timeout,
            snippet = 'curl -s';
        redirect = options.followRedirect ? options.followRedirect : true;
        timeout = options.requestTimeout ? options.requestTimeout : 0;

        if (redirect) {
            snippet += ' -L';
        }
        if (timeout > 0) {
            snippet += ` -m ${timeout}`;
        }

        indent = options.indentType === 'tab' ? '\t' : ' ';
        indent = ' \\\n' + indent.repeat(options.indentCount);
        trimOpt = options.trimRequestBody ? options.trimRequestBody : false;
        if (request.method === 'HEAD') {
            snippet += ` -I "${encodeURI(request.url.toString())}"`;
        }
        else {
            snippet += ` -X ${request.method} "${encodeURI(request.url.toString())}"`;
        }

        headersData = request.getHeaders({ enabled: true });
        _.forEach(headersData, function (value, key) {
            snippet += indent + `-H "${key}: ${value}"`;
        });

        body = request.body.toJSON();

        if (!_.isEmpty(body)) {
            switch (body.mode) {
                case 'urlencoded':
                    text = [];
                    _.forEach(body.urlencoded, function (data) {
                        if (!data.disabled) {
                            text.push(`${escape(data.key)}=${escape(data.value)}`);
                        }
                    });
                    snippet += indent + `-d "${text.join('&')}"`;
                    break;
                case 'raw':
                    snippet += indent + `--data-raw "${sanitize(body.raw.toString(), trimOpt)}"`;
                    break;
                case 'formdata':
                    _.forEach(body.formdata, function (data) {
                        if (!(data.disabled)) {
                            if (data.type === 'file') {
                                snippet += indent;
                                snippet += `-F "${sanitize(data.key, trimOpt)}=@${sanitize(data.src, trimOpt)}"`;
                            }
                            else {
                                snippet += indent;
                                snippet += `-F "${sanitize(data.key, trimOpt)}=${sanitize(data.value, trimOpt)}"`;
                            }
                        }
                    });
                    break;
                case 'file':
                    snippet += indent;
                    snippet += `--data-binary ${sanitize(body.key, trimOpt)}=@${sanitize(body.value, trimOpt)}`;
                    break;
                default:
                    snippet += '-d ""';
            }
        }
        callback(null, snippet);
    }
};

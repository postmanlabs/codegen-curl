var sanitize = require('./util').sanitize,
    _ = require('lodash');

module.exports = {
    convert: function (request, options, callback) {

        var indent, trimOpt, snippet, headersData, body, text, redirect, timeout;

        indent = options.indentType === 'tab' ? '\t' : ' ';
        indent = ' \\\n' + indent.repeat(options.indentCount);
        trimOpt = options.trimRequestBody ? options.trimRequestBody : false;
        snippet = `curl -X ${request.method} ${sanitize(request.url)}`;
        redirect = options.followRedirect ? options.followRedirect : true;
        timeout = options.requestTimeout ? options.requestTimeout : 0;

        if (redirect) {
            snippet += indent + '-L -s';
        }
        if (timeout > 0) {
            snippet += indent + `-m ${timeout}`;
        }

        headersData = request.getHeaders({ enabled: true });
        _.forEach(headersData, function (value, key) {
            snippet += indent + `-H '${key}: ${value}'`;
        });

        body = request.body.toJSON();

        if (!_.isEmpty(body)) {
            switch (body.mode) {
                case 'urlencoded':
                    text = [];
                    _.forEach(body.urlencoded, function (data) {
                        if (!data.disabled) {
                            text.push(`${sanitize(data.key, trimOpt)}=${sanitize(data.value, trimOpt)}`);
                        }
                    });
                    snippet += indent + `-d '${text.join('&')}'`;
                    break;
                case 'raw':
                    snippet += indent + `-d '${body.raw}'`;
                    break;
                case 'formdata':
                    _.forEach(body.formdata, function (data) {
                        if (!(data.disabled)) {
                            if (data.type === 'file') {
                                snippet += indent;
                                snippet += `-F ${sanitize(data.key, trimOpt)}=@${sanitize(data.value, trimOpt)}`;
                            }
                            else {
                                snippet += indent;
                                snippet += `-F ${sanitize(data.key, trimOpt)}=${sanitize(data.value, trimOpt)}`;
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

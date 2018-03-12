var sanitize = require('./util').sanitize;
    _ = require('lodash');

module.exports = {
    convert: function (request, options, callback) {

        var indentString = options.indentType === 'tab' ? '\t' : ' ';
        indentString =  ' \\ \n' + indentString.repeat(options.indentCount);
        var trimOpt = options.trimRequestBody;

        var snippet = `curl -X ${request.method}` + indentString;

        if (options.followRedirect) {
            snippet += '-L ';
        }
        if (options.requestTimeout > 0) {
            snippet += `-m ${options.requestTimeout}` + indentString;
        }

        var headersData = request.getHeaders({ enabled: true });
        _.forEach(headersData, function (value, key) {
            snippet += `-H \' ${key}: ${value}\'` + indentString;
        });

        var body = request.body.toJSON();

        if (body) {
            switch(body.mode) {
                case 'urlencoded':
                    var text = [];
                    _.forEach(body.urlencoded, function (data) {
                        if (!data.disabled) {
                            text.push(`${sanitize(body.key, trimOpt)}=${sanitize(body.value, trimOpt)}`);
                        }
                    });
                    snippet += `-d ${text.join('&')}`+ indentString;
                    break;
                case 'raw':
                    snippet += `-d \'${sanitize(body.raw, trimOpt)}\'` + indentString;
                    break;
                case 'formdata':
                    _.forEach(body.formdata, function (data) {
                        if (!(data.disabled)) {
                            if (data.type === 'file') {
                                snippet += `-F ${sanitize(body.key, trimOpt)}=@${sanitize(body.value, trimOpt)}` + indentString;
                            }
                            else {
                                snippet += `-F ${sanitize(body.key, trimOpt)}=${sanitize(body.value, trimOpt)}` + indentString;
                            }
                        }
                    });
                    break;
                case 'file':
                    snippet += `--data-binary ${sanitize(body.key, trimOpt)}=@${sanitize(body.value, trimOpt)}` + indentString;
            }
        }
        return snippet;
    }
}
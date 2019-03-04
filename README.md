# codegen-curl

[![Greenkeeper badge](https://badges.greenkeeper.io/postmanlabs/codegen-curl.svg)](https://greenkeeper.io/)

> Converts Postman-SDK Request into code snippet for cURL.

## Getting Started
To get a copy on your local machine
```bash
$ git clone git@github.com:postmanlabs/codegen-curl.git
```

#### Prerequisites
To run this code-generator, ensure that you have NodeJS >= v6. A copy of the NodeJS installable can be downloaded from https://nodejs.org/en/download/package-manager.

#### Installing dependencies
```bash
$ npm install;
```

## Using the Module
The module will expose an object which will have property `convert` which is the function for converting the Postman-SDK request to a cURL code snippet.

### convert function
The Convert function takes three parameters

* `request` - Postman-SDK Request Object

* `options` - options is an object which hsa following properties
    * `indentType` - String denoting type of indentation for code snippet. eg: 'space', 'tab'
    * `indentCount` - Integer denoting count of indentation required
    * `requestBodyTrim` - Boolean denoting whether to trim request body fields
    * `followRedirect` - Boolean denoting whether to redirect a request
    * `requestTimeout` - Integer denoting time after which the request will bail out in milli-seconds
    * `multiLine` - Boolean denoting whether to output code snippet with multi line breaks
    * `longFormat` - Boolean denoting whether to use longform cURL options in snippet

* `callback` - callback function with first parameter as error and second parameter as string for code snippet

##### Example:
```js
var request = new sdk.Request('www.google.com'),  //using postman sdk to create request  
    options = {
        indentCount: 3,
        indentType: 'space',
        requestTimeout: 200,
        requestBodyTrim: true,
        multiLine: true,
        followRedirect: true,
        longFormat: true
    };
convert(request, options, function(error, snippet) {
    if (error) {
        //  handle error
    }
    //  handle snippet
});
```

### Guidelines for using generated snippet

* Since the Postman-SDK Request object doesn't provide the complete path of the file, it needs to be manually inserted in case of uploading a file.

* This module doesn't support cookies.


## Running the tests

```bash
$ npm test
```

### Break down into unit tests

```bash
$ npm run test-unit
```
// test UglifyJS

var uglify = require('./UglifyJS/uglify-js.js');
var fs = require("fs");

var code = fs.readFileSync('case.source.js', 'utf8');

var compressorCode = uglify(code);

fs.writeFileSync('uglify_compressed.js', compressorCode, 'utf-8');



// test yuiCompressor
var exec = require('child_process').exec;

exec('java -jar ./yuicompressor.jar --type js --charset UTF-8 case.source.js -o yui_compressed.js', function(error, stdout, stderr){
    // fs.writeFileSync('case.js', stdout, 'utf-8');
});
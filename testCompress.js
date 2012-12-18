var fs = require("fs");

// test UglifyJS
var uglify = require('./UglifyJS/uglify-js.js');
var code = fs.readFileSync('case.source.js', 'utf8');
var compressorCode = uglify(code);
fs.writeFileSync('uglify_compressed.js', compressorCode, 'utf-8');

// test UglifyJS2
var uglify2 = require('./UglifyJS2/tools/node.js');
var compressorCode = uglify2.minify('case.source.js');
fs.writeFileSync('uglify2_compressed.js', compressorCode.code, 'utf-8');

// test yuiCompressor
var exec = require('child_process').exec;
exec('java -jar ./yuicompressor.jar --type js --charset UTF-8 case.source.js -o yui_compressed.js', function(error, stdout, stderr){});

// test Google Closure
var exec = require('child_process').exec;
exec('java -jar compiler.jar --js case.source.js --js_output_file closure_compressed.js', function(error, stdout, stderr){

});


// beauty
var code = fs.readFileSync('uglify_compressed.js', 'utf8');
var beautifiedCode = uglify(code, {
    gen_options: {
        beautify: true
    }
});
fs.writeFileSync('uglify_compressed_beautify.js', beautifiedCode, 'utf-8');

var code = fs.readFileSync('uglify2_compressed.js', 'utf8');
var beautifiedCode = uglify(code, {
    gen_options: {
        beautify: true
    }
});
fs.writeFileSync('uglify2_compressed_beautify.js', beautifiedCode, 'utf-8');


setTimeout(function(){
    var code = fs.readFileSync('yui_compressed.js', 'utf8');
    var beautifiedCode = uglify(code, {
        gen_options: {
            beautify: true
        }
    });
    fs.writeFileSync('yui_compressed_beautify.js', beautifiedCode, 'utf-8');

    var code = fs.readFileSync('closure_compressed.js', 'utf8');
    var beautifiedCode = uglify(code, {
        gen_options: {
            beautify: true
        }
    });
    fs.writeFileSync('closure_compressed_beautify.js', beautifiedCode, 'utf-8');
}, 5000);

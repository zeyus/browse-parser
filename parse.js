/* jshint node:true */

'use strict';

var fs = require('fs');
var peg = fs.readFileSync('./browse-content.peg.js', 'utf-8');
var parser = require('pegjs').buildParser(peg);

fs.readFile(process.argv.pop(), function(err, data) {
    if(err) {
        throw err;
    }
    process.stdout.write(JSON.stringify(parser.parse(data.toString()), null, 4));
});

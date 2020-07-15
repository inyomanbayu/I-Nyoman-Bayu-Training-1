const fs = require('fs');

//var files = fs.readdirSync('./');
//console.log(files);

fs.readdir('./', function (error, files) {
    if (error) {
        console.log("Error occured. Error message: " + error);
    } else {
        console.log('Files in this directory are: ' + files);
    }
});
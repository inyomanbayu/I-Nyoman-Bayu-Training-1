var url = 'http://mylogger.io/log';

function DisplayLog(log_message) {
    console.log(`Log message: ${log_message}`);
}

function DisplayURL() {
    console.log(`Log message: ${url}`);
}

module.exports.TampilkanLog = DisplayLog;
module.exports.TampilkanURL = DisplayURL;

DisplayLog("Test node app");
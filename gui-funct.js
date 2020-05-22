var is = require("electron-is");

function showOS() {
    if (is.windows())
        console.log("Windows Detected.")
    if (is.macOS())
        console.log("Apple OS Detected.")
    if (is.linux())
        console.log("Linux Detected.")
}

function login() {
    const process = require('child_process');

    showOS();
    var cmd = (is.windows()) ? 'test.bat' : './dispatch'; //TODO: change test.bat
    console.log('cmd:', cmd);

    var child = process.spawn(cmd, ['login']);

    child.on('error', function(err) {
        console.log('stderr: <'+err+'>' );
    });

    child.stdout.on('data', function (data) {
        console.log(data);
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
    });
}

function showBranches(appId) {
    const process = require('child_process');

    showOS();
    var cmd = (is.windows()) ? 'test.bat' : './dispatch'; //TODO: change test.bat
    console.log('cmd:', cmd);

    var child = process.spawn(cmd, ['branch', 'list', appId]);

    child.on('error', function(err) {
        console.log('stderr: <'+err+'>' );
    });

    child.stdout.on('data', function (data) {
        console.log(data);

        data = data + ''
        var data2 = data.split('|');

        var i = data2.length;
        while(i--) !/\S/.test(data2[i]) && data2.splice(i, 1);

        for (i = 0; i < data2.length; i++) {
            data2[i] = data2[i].replace(/\s+/g, '');
            data2[i] = data2[i].replace('APPLICATIONID', '');
            data2[i] = data2[i].replace('BRANCHID', '');
            data2[i] = data2[i].replace('NAME', '');
            data2[i] = data2[i].replace('LIVE_BUILD_ID', '');
            data2[i] = data2[i].replace('CREATEDAT', '');
            data2[i] = data2[i].replace(/-/g, '');
        }

        var i = data2.length;
        while(i--) !/\S/.test(data2[i]) && data2.splice(i, 1);

        for (i = 0; i < data2.length; i++) {
            if (data2[i] == appId && !isNaN(data2[i+1])) {
                var branch;

                if (!data2[i+3].endsWith("Z")) {
                    branch = new Branch(data2[i], data2[i+1], data2[i+2], data2[i+3], data2[i+4])
                } else {
                    branch = new Branch(data2[i], data2[i+1], data2[i+2], "", data2[i+3])
                }

                branchList.push(branch);
            }
        }
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
    });
}

class Branch {
    constructor(appId, branchId, name, liveBuildId, createdAt) {
        this.appId = appId;
        this.branchId = branchId;
        this.name = name;
        this.liveBuildId = liveBuildId;
        this.createdAt = createdAt;
    }
}

var branchList = [];
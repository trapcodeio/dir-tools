const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('./config.js');

const folder = config.dir;
const log = (...args) => {
    console.log(chalk.cyanBright('==> '), chalk.cyanBright(...args));
};

const logError = (...args) => {
    console.log(chalk.redBright('Error: '), chalk.redBright(...args));
};

const logErrorAndExit = (...args) => {
    logError(...args);
    process.exit();
};


const dirPath = ($path = '') => {
    $path = folder + '/' + $path;
    if ($path.substr(-1) === '/')
        $path = $path.substr(0, $path.length - 1);
    return path.resolve($path);
};

const allFilesIn = ($dir, $onEachFn) => {
    if (!fs.existsSync($dir)) {
        logErrorAndExit(`Cannot Access folder ${$dir}`)
    }

    let $dirPath = fs.readdirSync($dir);
    for (let i = 0; i < $dirPath.length; i++) {
        let $path = $dirPath[i];

        if ($path.substr(0, 1) !== '.') {
            $onEachFn($path, $dir + '/' + $path);
        }
    }
};

let FileCounter = 0;
let DirCounter = 0;
let FileRenamed = 0;

const renameExtension = ($file, $from, $to) => {
    if (fs.lstatSync($file).isFile()) {
        $to = '.' + $to;
        $from = '.' + $from;

        if ($file.substr(-$from.length) === $from) {

            let newPath = $file.substr(0, $file.length - $from.length) + $to;

            fs.renameSync($file, newPath);

            FileRenamed++;
        }
    }
};


const onEachDirItem = ($path, $fullPath) => {
    if (fs.lstatSync($fullPath).isDirectory()) {
        DirCounter++;
        allFilesIn($fullPath, onEachDirItem)
    } else if (fs.lstatSync($fullPath).isFile()) {
        FileCounter++;
        renameExtension($fullPath, config.rename.from, config.rename.to);
    }
};

allFilesIn(dirPath(), onEachDirItem);

log(DirCounter + ' Folders');
log(FileCounter + ' Files');
log(FileRenamed + ' Files renamed!');
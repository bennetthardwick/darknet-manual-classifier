import { lstatSync, readdirSync, createReadStream, createWriteStream, writeFileSync } from 'fs';
import { join } from 'path';

import { get } from 'request';

export const isDirectory = (source) => lstatSync(source).isDirectory();
export const isFile = (source) => !isDirectory(source);
export const isFileFactory = (source) => (file) => !isDirectory(join(source, file)); 
export const getDirectories = (source) => readdirSync(source).map(name => join(source, name)).filter(isDirectory);
export const getFiles = (source) =>readdirSync(source).map(name => join(source, name)).filter(isFile);
export const getFilesWithoutSource = (source) =>readdirSync(source).filter(isFileFactory(source));

export function createFile(source, body) {
  writeFileSync(source, body);
}

export function downloadFile(source, target) {
  get(source)
  .on('error', function(err) {
    console.error(err)
  })
  .pipe(createWriteStream(target))
}

export function copyFile(source, target) {

  return new Promise<void>((resolve, reject) => {
    var cbCalled = false;

    var rd = createReadStream(source);
    rd.on("error", function(err) {
      done(err);
    });
    var wr = createWriteStream(target);
    wr.on("error", function(err) {
      done(err);
    });
    wr.on("close", function(ex) {
      done(null);
    });
    rd.pipe(wr);

    function done(err) {
      if (!cbCalled) {
        resolve(err);
        cbCalled = true;
      }
    }
  }); 
}
import { getDirectories, getFiles, getFilesWithoutSource, createFile, copyFile, downloadFile } from './files';
import { Path, Raster } from 'paper';
import { join } from 'path';
import * as fs from 'fs';

interface darknetSize {
  width: number;
  height: number;
}

interface darknetBox {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

interface darknetRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface darknetFeature {
  label: string;
  box: darknetRect;
}

function getBox(rectangle: Path.Rectangle): darknetBox {
  return {
    xmin: Math.min(rectangle.bounds.topLeft.x, rectangle.bounds.bottomRight.x),
    xmax: Math.max(rectangle.bounds.topLeft.x, rectangle.bounds.bottomRight.x),
    ymin: Math.min(rectangle.bounds.topLeft.y, rectangle.bounds.bottomRight.y),
    ymax: Math.max(rectangle.bounds.topLeft.y, rectangle.bounds.bottomRight.y)
  }
}

function getSize(image: Raster): darknetSize {
  return {
    width: image.width,
    height: image.height
  }
}

export function save(feature: string, rectangles: Path.Rectangle[], image: Raster, url: string, onDisk?: boolean) {

  console.log('saving');

  if (typeof onDisk === 'undefined') onDisk = false;

  let features: darknetFeature[] = [];

  rectangles.forEach(rectangle => {
    features.push({ label: feature, box: convert(getSize(image), getBox(rectangle))});
  });

  writeRectanglesToFile(url, features, onDisk);

}


function convert(size: darknetSize, box: darknetBox): darknetRect {
  let dw = 1.0 / size.width;
  let dh = 1.0 / size.height;
  let x = (box.xmin + box.xmax) / 2.0 - 1.0;
  let y = (box.ymin + box.ymax) / 2.0 - 1.0;
  let w = box.xmax - box.xmin;
  let h = box.ymax - box.ymin;

  x *= dw;
  w *= dw;

  y *= dh;
  h *= dh;

  console.log(dh);

  return { x, w, y, h };
}

function createDarknetString(feature: darknetFeature): string {
  return `${feature.label} ${feature.box.x} ${feature.box.y} ${feature.box.w} ${feature.box.h}`;
}

function writeRectanglesToFile(imageUrl: string, features: darknetFeature[], onDisk: boolean): void { 


  let files = getFilesWithoutSource('./data/features').sort();
  let latestIndex = parseInt(files[files.length - 1].split('.txt')[0]) + 1;

  let lines: string[] = [];

  features.forEach((feature) => {
    lines.push(createDarknetString(feature));
  });

  createFile('./data/features/' + ("000000000000" + (latestIndex).toString()).slice(-12) + '.txt', lines.join('\n'));
  
  let file = imageUrl.split('/')[imageUrl.split('/').length - 1];
  let extension = file.split('.')[file.split('.').length - 1];
  let imageDest =  './data/images/' + ("000000000000" + (latestIndex).toString()).slice(-12) + '.' + extension;

  if (onDisk) copyFile('./public/' + imageUrl, imageDest);
  else downloadFile(imageUrl, imageDest);
}

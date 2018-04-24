import { setup, view, Raster, Path, Point, Tool, Color, Rectangle, Size } from 'paper';
import * as gen from 'color-generator';

function createRaster(element: HTMLElement): Raster {
  let raster = new Raster(element);
  raster.position = new Point(raster.width / 2, raster.height / 2);
  return raster;
}

export const loadPaper = () => {
  let rectangles: Path.Rectangle[] = [];
  let currentIndex = 0;
  let colour: string;
  let begin: Point;

  let dragging: boolean = false;

  let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');

  setup(canvas);

  let raster = createRaster(document.getElementById('image'));

  view.draw();

  view.onMouseDown = function(event) {

    if (event.point.x <= 0 || event.point.x >= raster.width) return;
    if (event.point.y <= 0 || event.point.y >= raster.height) return;

    dragging = true;

    begin = event.point;
    colour = gen().hexString();
    rectangles[currentIndex] = new Path.Rectangle(begin, event.point);
    rectangles[currentIndex].strokeColor = colour;
    rectangles[currentIndex].strokeWidth = 3;
  }

  view.onMouseDrag = function(event) {

    if(!dragging) return;

    let end = event.point;

    if (end.x >= raster.width) {
      end.x = raster.width - 1;
    }

    if (end.x <= 0) {
      end.x = 1;
    }

    if (end.y <= 0) {
      end.y = 0;
    }

    if (end.y >= raster.height) {
      end.y = raster.height - 1;
    }

    rectangles[currentIndex].remove();
    rectangles[currentIndex] = new Path.Rectangle(begin, end);
    rectangles[currentIndex].strokeColor = colour;
    rectangles[currentIndex].strokeWidth = 3;
  }

  view.onMouseUp = function(event) {
    if (dragging) currentIndex++;
    dragging = false;
  }

  document.addEventListener('keydown', (event) => {

    let diff = (event.shiftKey) ? 50 : 10;

    switch (event.key) {
      case "ArrowLeft":
        view.center = new Point(view.center.x + diff, view.center.y);
      break;
      
      case "ArrowRight":
        view.center = new Point(view.center.x - diff, view.center.y);
      break;

      case "ArrowUp":
        view.center = new Point(view.center.x, view.center.y + diff);
      break;

      case "ArrowDown":
        view.center = new Point(view.center.x, view.center.y - diff);
      break;

      case "]":
        view.zoom += 0.01;
      break;

      case "[":
        view.zoom -= 0.01;
      break;

      default:
        break;
    }
  });

  document.addEventListener('keypress', (event) => {
    if (event.ctrlKey && event.key === 'z' && currentIndex > 0) {
      currentIndex--;
      rectangles[currentIndex].remove();
      delete rectangles[currentIndex];
      return;
    }

    // loadNewImage("http://images.clipartpanda.com/cliparts-images-KTnEXXbTq.jpeg");
    // rectangles.forEach(x => x.remove());
    // currentIndex = 0;
    // rectangles = [];

  });

  function loadNewImage(url: string) {
    let image = <HTMLImageElement> document.getElementById('image')
    image.src = url;

    image.onload = function() {
      raster = createRaster(image);
    }
  }

  document.getElementById('save').click = () => {
    
  }

  document.getElementById('urlImage').click = () => {

  }

  document.getElementById('randomImage').click = () => {

  }

}


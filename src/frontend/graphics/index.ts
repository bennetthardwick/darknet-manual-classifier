import * as paper from 'paper';

export const loadPaper = () => {
  let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');

  paper.setup(canvas);

  let path = new paper.Path();
  let start = new paper.Point(100, 100);
  
  path.strokeColor = 'black';
  path.moveTo(start);
  path.lineTo(start.add([200, -50]));

  paper.view.draw();
}
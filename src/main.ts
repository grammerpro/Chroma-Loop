import { Game } from './game';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const game = new Game(canvas, ctx);

function resize() {
  const size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
  game.resize(size);
}

window.addEventListener('resize', resize);
resize();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
}

game.start();

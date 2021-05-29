import "../styles/styles.css"
import { canvas, start, score } from "./canvas";
import c from "./constants";

var endloop;
var hide;

function init(){
    var pressToStart = document.createElement("div");
    pressToStart.classList.add("canvas-text");
    pressToStart.classList.add("show");
    pressToStart.innerText = "Press SPACEBAR To Start";

    document.body.appendChild(pressToStart);

    function hide(){
        pressToStart.classList.remove("show");
    }

    return hide;
}

function handelKeyPress(e) {
	switch (e.code) {
		// Starts the game on hitting space
		case "Space":
			hide();
			if (c.gameOver){
				c.isRunning = false;
				endloop();
			}
			if (!c.isRunning) endloop = start();
			else endloop();
			c.isRunning = !c.isRunning;
			break;
		case "ArrowUp":
		case "KeyW":
			c.xSpeed = 0;
			c.ySpeed = -1;
			c.direction = "u";
			break;
		case "ArrowDown":
		case "KeyS":
			c.xSpeed = 0;
			c.ySpeed = 1;
			c.direction = "d";
			break;
		case "ArrowRight":
		case "KeyD":
			c.xSpeed = 1;
			c.ySpeed = 0;
			c.direction = "r";
			break;
		case "ArrowLeft":
		case "KeyA":
			c.xSpeed = -1;
			c.ySpeed = 0;
			c.direction = "l";
			break;
	}
}

export default function main() {
	document.body.appendChild(score);
	document.body.appendChild(canvas);

	hide = init();

	window.addEventListener("keydown", handelKeyPress);
}

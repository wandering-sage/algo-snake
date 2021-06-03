import "../styles/styles.css"
import { autoAstar } from "./autoPlay";
import { aStar } from "./a_star";
import { goBfs } from "./bfs";
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

function makeButton(parent, title, classList, onclick){
	var button = document.createElement("button");
	button.classList = classList;
	button.innerText = title;
	parent.appendChild(button);
	button.addEventListener("click", e=>{
		e.target.blur();
		onclick();
	})
	return button;
}

function makeField(cls, str){
	var container = document.createElement("fieldset");
	container.classList.add(cls);
	var heading = document.createElement("legend");
	heading.innerText = str;
	container.appendChild(heading);
	return container;
}

export default function main() {
	document.body.appendChild(score);
	document.body.appendChild(canvas);

	hide = init();

	window.addEventListener("keydown", handelKeyPress);

	var controls = makeField("controls", "Path Finders");
	document.body.appendChild(controls);
	var bfsButton = makeButton(controls, "Dijkstra's Algorithm", "button", goBfs);
	var aStartButton = makeButton(controls, "A Star Algorithm", "button", aStar);

	var autoPlay = makeField("auto-container", "Auto Play");
	document.body.appendChild(autoPlay);
	var autoAstarbtn = makeButton(autoPlay, "Use A-Star", "button", autoAstar);


}

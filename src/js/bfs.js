import { canvas, ctx } from "./canvas";
import c from "./constants";
import snake from "./snake";

class Queue {
	constructor() {
		this.items = [];
	}
	enqueue(element) {
		this.items.push(element);
	}
	dequeue() {
		return this.items.shift();
	}
	isEmpty() {
		return this.items.length == 0;
	}
}

var timeOut;

function goBfs() {
	timeOut = 0;
	var q = new Queue();
	var visited = [];
	for (let i = 0; i < c.canvasW/c.scale; i++) {
		visited[i] = [];
		for (let j = 0; j < c.canvasH/c.scale; j++) {
			visited[i][j] = false;
		}
	}
	q.enqueue({
		x: c.headX,
		y: c.headY,
		parent: "head",
	});
	var found = false;
	while (!q.isEmpty()) {
		var curr = q.dequeue();
		var neighbors = getNeighbors(curr);
		neighbors.every((e) => {
			if (e.x == c.AppleX && e.y == c.AppleY) {
				e.parent = curr;
				found = e;
				return false;
			}
			if (!visited[e.x / c.scale][e.y / c.scale]) {
				visited[e.x / c.scale][e.y / c.scale] = true;
				e.parent = curr;
				q.enqueue(e);
				setTimeout(fillPixels, timeOut, e, "#D3868C");
				timeOut+=5 ;
			}
			return true;
		});
		if (found) {
			makePath(found);
			break;
		}
	}
}

function makePath(loc){
	if(loc.parent == "head"){
		setTimeout(fillPixels, timeOut, loc, "#2B8C34");
		timeOut += 20;
		return;
	}
	makePath(loc.parent);
	setTimeout(fillPixels, timeOut, loc, "#2B8C34");
	timeOut += 20;
}

function fillPixels({x,y}, color){
	ctx.fillStyle = color;
	ctx.fillRect(x, y, c.scale, c.scale);
	snake.draw(ctx);
}

function getNeighbors({ x, y }) {
	if (x < 0 || y < 0 || x >= c.canvasW || y >= c.canvasH) {
		return [];
	}
	var ret = [];
	var l = { x: x - c.scale, y: y };
	var r = { x: x + c.scale, y: y };
	var u = { x: x, y: y - c.scale };
	var d = { x: x, y: y + c.scale };
	if (u.y >= 0 && !snake.onSnake(u)) {
		ret.push(u);
	}
	if (r.x < c.canvasW && !snake.onSnake(r)) {
		ret.push(r);
	}
	if (u.y < c.canvasH && !snake.onSnake(d)) {
		ret.push(d);
	}
	if (l.x >= 0 && !snake.onSnake(l)) {
		ret.push(l);
	}
	return ret;
}

export { goBfs };

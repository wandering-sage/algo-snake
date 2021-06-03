import { canvas, ctx } from "./canvas";
import c from "./constants";
import snake from "./snake";

var timeOut;

function aStar() {
	timeOut = 0;
	var storage = [];
	var visited = [];
	for (let i = 0; i < c.canvasW/c.scale; i++) {
		visited[i] = [];
		for (let j = 0; j < c.canvasH/c.scale; j++) {
			visited[i][j] = false;
		}
	}
	storage.push({
		x: c.headX,
		y: c.headY,
		parent: "head",
		f:
			Math.abs(c.headX / c.scale - c.AppleX / c.scale) +
			Math.abs(c.headY / c.scale - c.AppleY / c.scale),
		g: 0,
	});
	visited[c.headX / c.scale][c.headY / c.scale] = true;
	var found = false; 
	while (storage.length > 0) {
		var idx = 0;
		var curr = storage.reduce((acc, crr, i) => {
			idx = acc.f < crr.f ? idx : i;
			return acc.f < crr.f ? acc : crr;
		});
		storage.splice(idx,1);
		setTimeout(fillPixels, timeOut, curr, "#D3868C");
		timeOut += 10;
		var neighbors = getNeighbors(curr);
		neighbors.every((e) => {
			if (e.x == c.AppleX && e.y == c.AppleY) {
				e.parent = curr;
				found = e;
				return false;
			}
			if (!visited[e.x / c.scale][e.y / c.scale]) {
				visited[e.x / c.scale][e.y / c.scale] = true;
				addHurestic(e);
				e.parent = curr;
				storage.push(e);
			}
			return true;
		});
		if (found) {
			makePath(found);
			break;
		}
	}
}

function makePath(loc) {
	if (loc.parent == "head") {
		setTimeout(fillPixels, timeOut, loc, "#2B8C34");
		timeOut += 20;
		return;
	}
	makePath(loc.parent);
	setTimeout(fillPixels, timeOut, loc, "#2B8C34");
	timeOut += 20;
}

function fillPixels({ x, y }, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, c.scale, c.scale);
	snake.draw(ctx);
}

function addHurestic(el) {
	el.h =
		Math.abs(el.x / c.scale - c.AppleX / c.scale) +
		Math.abs(el.y / c.scale - c.AppleY / c.scale);
	el.f = el.g + el.h;
}

function getNeighbors({ x, y, g }) {
	if (x < 0 || y < 0 || x >= c.canvasW || y >= c.canvasH) {
		return [];
	}
	var ret = [];
	var l = { x: x - c.scale, y: y, g: g + 1 };
	var r = { x: x + c.scale, y: y, g: g + 1 };
	var u = { x: x, y: y - c.scale, g: g + 1 };
	var d = { x: x, y: y + c.scale, g: g + 1 };
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

export { aStar, addHurestic, getNeighbors, fillPixels };

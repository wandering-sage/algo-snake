import c from "./constants";
import {getNeighbors, addHurestic, fillPixels} from "./a_star";
import snake from "./snake";

function walkOnPath(curr){
    var last = {x: c.headX, y: c.headY};
    var delay = 1000/c.gameSpeed;
    var dirX = (curr.x - last.x) / c.scale;
    var dirY = (curr.y - last.y) / c.scale;
    var dirKey = getDirKey(dirX, dirY);
    pressThis(dirKey);
    setTimeout(autoAstar, delay); 
}

function getDirKey(x,y){
    if(x==0 && y==1){
        return "KeyS";
    }
    if(x==0 && y==-1){
        return "KeyW";
    }
    if(x==1 && y==0){
        return "KeyD";
    }
    if(x==-1 && y==0){
        return "KeyA";
    }
}

function survivalMode(){
    var curr = {x: c.headX, y: c.headY, g: 0, parent: "head"};
	var maxLen = curr.g;
	var maxNext = curr;
	var possibleMoves = getNeighbors(curr);
	if(possibleMoves.length==0){
		return;
	}
	var visited = [];
	for (let i = 0; i < c.canvasW/c.scale; i++) {
		visited[i] = [];
		for (let j = 0; j < c.canvasH/c.scale; j++) {
			visited[i][j] = false;
		}
	}
	getLongestPath(curr);
	console.log(maxLen);
	walkOnPath(getAstarPath(maxNext));

	function getLongestPath(node){
		var avaliabeSquares = (c.canvasH/c.scale)*(c.canvasW/c.scale)-c.tail.length;
		if(visited[node.x/c.scale][node.y/c.scale] || maxLen>avaliabeSquares/2){
			return;
		}
		visited[node.x/c.scale][node.y/c.scale] = true;
		if(node.g>maxLen){
			maxLen = node.g;
			maxNext = node;
		}
		var neighbors = getNeighbors(node);
		neighbors.forEach(n=>{
			n.parent = node
			getLongestPath(n);
		})
	}
}

function pressThis(k){
    window.dispatchEvent(new KeyboardEvent('keydown',{'code':k}));
}

function getAstarPath(loc){
    var ret;
    while (loc.parent != "head") {
        ret = loc;
		loc = loc.parent;
	}
    return ret;
}

function autoAstar() {
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
			walkOnPath(getAstarPath(found));
			break;
		}
	}
	if(!found){
		survivalMode();
	}
}


export {autoAstar};
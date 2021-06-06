import c from "./constants";
import { score } from "./canvas";

var x = c.initSnakeX * c.scale;
var y = c.initSnakeY * c.scale;
c.tail = c.initSnakeTail.slice(0);
var len = c.initSnakeLen;
var currentLenGrow = 0;

function draw(ctx) {
	ctx.fillStyle = "#ddd";
	c.tail.forEach((pt, i) => {
		if(i<c.tail.length){
			connectTail(c.tail[i]);
		}
		ctx.fillStyle = "#ddd";
		ctx.fillRect(pt.x+1, pt.y+1, c.scale-2, c.scale-2);
	});
	ctx.fillStyle = "#ac2c2c";
	ctx.fillRect(c.AppleX+1, c.AppleY+1, c.scale-2, c.scale-2);
	ctx.beginPath();
	switch (c.direction) {
		case "l":
			ctx.moveTo(x + c.scale-1, y+1);
			ctx.lineTo(x+1, y+1);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x+1, y + c.scale-1);
			ctx.lineTo(x + c.scale-1, y + c.scale-1);
			break;
		case "r":
			ctx.moveTo(x+1, y+1);
			ctx.lineTo(x + c.scale-1, y+1);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x + c.scale-1, y + c.scale-1);
			ctx.lineTo(x+1, y + c.scale-1);
			break;
		case "u":
			ctx.moveTo(x+1, y + c.scale-1);
			ctx.lineTo(x+1, y+1);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x + c.scale-1, y+1);
			ctx.lineTo(x + c.scale-1, y + c.scale-1);
			break;
		case "d":
			ctx.moveTo(x+1, y+1);
			ctx.lineTo(x+1, y + c.scale-1);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x + c.scale-1, y + c.scale-1);
			ctx.lineTo(x + c.scale-1, y+1);
			break;
	}
	ctx.closePath();
	ctx.fillStyle = "#ddd";
	ctx.fill();

	function connectTail(last){
		// ctx.fillStyle = "red";
		switch(last.direction){
			case "l":
				ctx.fillRect(last.x+1,last.y+1,-2,c.scale-2);
				break;
			case "r":
				ctx.fillRect(last.x+c.scale-1,last.y+1,2,c.scale-2);
				break;
			case "u":
				ctx.fillRect(last.x+1,last.y+1,c.scale-2, -2);
				break;
			case "d":
				ctx.fillRect(last.x+1,last.y+c.scale-1,c.scale-2, 2);
				break;
		}
	}
}

function update() {
	var direction = c.direction;
	// TODO: add oriantation detection on tail, and make gaps between snake movements
	// check Collision
	if (onSnake({ x, y })) {
		c.gameOver = true;
		return "Over";
	}

	// check  hit wall 
	if(y<0 || x<0 || x>=c.canvasW || y>=c.canvasH){
		c.gameOver = true;
		return "Over";
	}

	var temp = { x, y, direction };

	// moving tail one steap ahead
	for (var i = 0; i < len; i++) {
		[temp, c.tail[i]] = [c.tail[i], temp];
	}

	if(currentLenGrow>0){
		c.tail[len] = temp;
		len++;
		currentLenGrow--;
	}

	if (eatApple()) {
		updateScore();
		currentLenGrow += c.growth;
		c.tail[len] = temp;
		len++;
		currentLenGrow--;
		getNewLocation();
	}
	x += c.xSpeed * c.scale;
	y += c.ySpeed * c.scale;
	c.headX = x;
	c.headY = y;
}

function respawn() {
	x = c.initSnakeX * c.scale;
	y = c.initSnakeY * c.scale;
	c.tail = c.initSnakeTail.slice(0);
	len = c.initSnakeLen;
	c.direction = "r";
	c.xSpeed = 1;
	c.ySpeed = 0;
	currentLenGrow = 0;
	score.innerText = "00000";
}

function eatApple() {
	return x == c.AppleX && y == c.AppleY;
}

function getNewLocation() {
	var pos = {};
	pos.x = Math.floor(Math.random() * (c.canvasW / c.scale)) * c.scale;
	pos.y = Math.floor(Math.random() * (c.canvasH / c.scale)) * c.scale;
	// generate new position if snake is already there
	while (onSnake(pos)) {
		pos.x = Math.floor(Math.random() * (c.canvasW / c.scale)) * c.scale;
		pos.y = Math.floor(Math.random() * (c.canvasH / c.scale)) * c.scale;
	}
	c.AppleX = pos.x;
	c.AppleY = pos.y;
}

function onSnake(pos) {
	return c.tail.reduce((acc, crr) => {
		return acc || (crr.x == pos.x && crr.y == pos.y);
	}, false);
}

function updateScore(){
	var curScore = Number(score.innerText);
	curScore+=10;
	curScore = String(curScore);
	score.innerText = "0".repeat(5-curScore.length)+curScore;
}

export default { draw, update, onSnake, respawn };

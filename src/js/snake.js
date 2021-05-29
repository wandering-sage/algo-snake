import c from "./constants";
import { score } from "./canvas";

var x = c.initSnakeX * c.scale;
var y = c.initSnakeY * c.scale;
var tail = c.initSnakeTail.slice(0);
var len = c.initSnakeLen;
var currentLenGrow = 0;

function draw(ctx) {
	ctx.fillStyle = "#ddd";
	tail.forEach((pt) => {
		ctx.fillRect(pt.x, pt.y, c.scale, c.scale);
	});
	ctx.fillStyle = "#ac2c2c";
	ctx.fillRect(c.AppleX, c.AppleY, c.scale, c.scale);
	ctx.beginPath();
	switch (c.direction) {
		case "l":
			ctx.moveTo(x + c.scale, y);
			ctx.lineTo(x, y);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x, y + c.scale);
			ctx.lineTo(x + c.scale, y + c.scale);
			break;
		case "r":
			ctx.moveTo(x, y);
			ctx.lineTo(x + c.scale, y);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x + c.scale, y + c.scale);
			ctx.lineTo(x, y + c.scale);
			break;
		case "u":
			ctx.moveTo(x, y + c.scale);
			ctx.lineTo(x, y);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x + c.scale, y);
			ctx.lineTo(x + c.scale, y + c.scale);
			break;
		case "d":
			ctx.moveTo(x, y);
			ctx.lineTo(x, y + c.scale);
			ctx.lineTo(x + c.scale / 2, y + c.scale / 2);
			ctx.lineTo(x + c.scale, y + c.scale);
			ctx.lineTo(x + c.scale, y);
			break;
	}
	ctx.closePath();
	ctx.fillStyle = "#ddd";
	ctx.fill();
}

function update() {
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

	var temp = { x, y };

	// moving tail one steap ahead
	for (var i = 0; i < len; i++) {
		[temp, tail[i]] = [tail[i], temp];
	}

	if(currentLenGrow>0){
		tail[len] = temp;
		len++;
		currentLenGrow--;
	}

	if (eatApple()) {
		updateScore();
		currentLenGrow += c.growth;
		tail[len] = temp;
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
	tail = c.initSnakeTail.slice(0);
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
	return tail.reduce((acc, crr) => {
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

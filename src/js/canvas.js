import "../styles/canvas.css";
import c from "./constants"
import snake from "./snake";

var canvas = document.createElement("canvas");
canvas.height = c.canvasH;
canvas.width = c.canvasW;

var ctx = canvas.getContext("2d");
var hideGO;

function start() {
    var tout;
    var currLoop;
    if(c.gameOver){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        snake.respawn();
        hideGO();
        c.gameOver = false;
    }
    function loop(){
        currLoop = Date.now()
        ctx.clearRect(0,0,canvas.width, canvas.height);
        var state = snake.update();
        snake.draw(ctx);
        tout = setTimeout(loop, 1000 / c.gameSpeed);
        if(state=="Over"){
            endLoop();
            hideGO = gameOver();
            var btns = document.querySelectorAll(".auto-container button");
            btns.forEach(b=>{
                b.classList.remove("active");
            })
        }
    }
    function endLoop(){
        clearTimeout(tout);
    }
    loop();
    return endLoop;
}

function gameOver(){
    var goText = document.createElement("div");
    goText.classList.add("game-over-text");
    goText.innerText = "GAME OVER";
    document.body.appendChild(goText);

    var pressSpace = document.createElement("div");
    pressSpace.classList.add("restart-text");
    pressSpace.innerText = "Press SPACEBAR To Restart";

    document.body.appendChild(pressSpace);

    function hide(){
        goText.remove();
        pressSpace.remove();
    }

    return hide;
}

var score = document.createElement("div");
score.classList.add("score-board");
score.innerText = "00000";

export { canvas, start, score, ctx};

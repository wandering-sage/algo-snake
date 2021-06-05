import "../styles/instructions.css";
import img1 from "../images/moveKeys1.png";
import img2 from "../images/moveKeys2.png";
import img3 from "../images/spaceKey.png";

var points = [
    `Use <img src=${img1} alt="wasd keys" /> or <img src=${img2} alt="arrow keys" /> to move.`,
    `Use <img src=${img3} alt="spacebar" /> to Pause/Play.`,
    "To visualize a pathfinding algo, pause the game first, then click the button.",
    "To auto play just click the button in a running game."
];

function openPopup() {
	var blurScr = document.createElement("div");
	blurScr.classList.add("blur-bg");
	document.body.appendChild(blurScr);
	blurScr.addEventListener("click", closePopup);
	document.body.addEventListener("keypress", closePopup);

	var popup = document.createElement("div");
	popup.classList.add("popup");
	document.body.appendChild(popup);

	var closeBtn = document.createElement("button");
	closeBtn.classList.add("close-btn");
	closeBtn.innerText = "X";
	closeBtn.onclick = closePopup;
	popup.appendChild(closeBtn);

    var ul = document.createElement("ul");
    points.forEach(e=>{
        var li = document.createElement("li");
        li.innerHTML = e;
        ul.appendChild(li);
    });
    popup.appendChild(ul);

	return popup;

	function closePopup() {
		blurScr.remove();
		popup.remove();
	}
}

export { openPopup };

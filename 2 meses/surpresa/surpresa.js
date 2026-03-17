const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const finalMessage = document.getElementById("finalMessage");

let score = 0;
let time = 10;
let gameInterval;
let heartInterval;

startBtn.onclick = startGame;

function startGame(){

score = 0;
time = 10;

scoreEl.textContent = score;
timeEl.textContent = time;

finalMessage.textContent = "";
gameArea.innerHTML = "";

startBtn.style.display = "none";

heartInterval = setInterval(createHeart,500);

gameInterval = setInterval(()=>{

time--;
timeEl.textContent = time;

if(time <= 0){
endGame();
}

},1000);

}

function createHeart(){

const heart = document.createElement("div");
heart.className = "heart";
heart.textContent = "❤️";

const areaWidth = gameArea.clientWidth - 40;
const areaHeight = gameArea.clientHeight - 40;

heart.style.left = Math.random() * areaWidth + "px";
heart.style.top = Math.random() * areaHeight + "px";

heart.onclick = () =>{

score++;
scoreEl.textContent = score;
heart.remove();

};

gameArea.appendChild(heart);

setTimeout(()=>{
heart.remove();
},1500);

}

function endGame(){

clearInterval(gameInterval);
clearInterval(heartInterval);

gameArea.innerHTML = "";

finalMessage.innerHTML = `
Você clicou <strong>${score}</strong> corações ❤️<br><br>
Mesmo que você clique mil corações,<br>
nenhum representa o quanto eu te amo, EU TE AMO INFINITAMENTE💗
`;

startBtn.style.display = "inline-block";

}
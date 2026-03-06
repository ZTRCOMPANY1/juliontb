const startDate = new Date("2026-01-10")

function updateCounter(){

const now = new Date()
const diff = now - startDate

const seconds = Math.floor(diff/1000)%60
const minutes = Math.floor(diff/1000/60)%60
const hours = Math.floor(diff/1000/60/60)%24
const days = Math.floor(diff/1000/60/60/24)

daysEl = document.getElementById("days")
hoursEl = document.getElementById("hours")
minutesEl = document.getElementById("minutes")
secondsEl = document.getElementById("seconds")

if(daysEl){

daysEl.textContent = days
hoursEl.textContent = hours
minutesEl.textContent = minutes
secondsEl.textContent = seconds

}

}

setInterval(updateCounter,1000)



function surpresa(){

document.getElementById("mensagemFinal").innerText =
"Esses foram apenas os primeiros 2 meses... mal posso esperar para viver muitos outros momentos incríveis com você. Eu te amo ❤️"

}



const canvas = document.getElementById("hearts")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let hearts=[]

for(let i=0;i<40;i++){

hearts.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*20+10,
speed:Math.random()*2+1

})

}

function drawHeart(x,y,size){

ctx.fillStyle="rgba(255,255,255,0.8)"
ctx.beginPath()
ctx.moveTo(x,y)
ctx.bezierCurveTo(x-size/2,y-size/2,x-size,y+size/3,x,y+size)
ctx.bezierCurveTo(x+size,y+size/3,x+size/2,y-size/2,x,y)
ctx.fill()

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height)

hearts.forEach(h=>{

drawHeart(h.x,h.y,h.size)

h.y+=h.speed

if(h.y>canvas.height){

h.y=-10
h.x=Math.random()*canvas.width

}

})

requestAnimationFrame(animate)

}


function abrirFoto(src,texto){

document.getElementById("fotoModal").style.display="flex"
document.getElementById("modalImg").src=src
document.getElementById("modalText").innerText=texto

}

function fecharFoto(){

document.getElementById("fotoModal").style.display="none"

}


const musica = document.getElementById("musica");
const playBtn = document.getElementById("playBtn");

playBtn.onclick = () => {

if(musica.paused){
musica.play();
playBtn.innerText="⏸ Pausar Música";
}else{
musica.pause();
playBtn.innerText="▶ Tocar Música";
}

};



animate()
const texto = "Hoje é o Dia da Mulher... e eu só queria lembrar que a mulher mais incrível do mundo é você.";
let i = 0;

function digitar(){

if(i < texto.length){

document.getElementById("mensagem").innerHTML += texto.charAt(i);

i++;

setTimeout(digitar,40);

}

}

digitar();


function criarCoracao(){

const container = document.querySelector(".heart-container");

const heart = document.createElement("div");

heart.classList.add("heart");

heart.style.left = Math.random()*100+"vw";

heart.style.animationDuration = (4 + Math.random()*4)+"s";

heart.style.transform += " rotateY("+Math.random()*360+"deg)";

container.appendChild(heart);

setTimeout(()=>{
heart.remove();
},8000);

}

setInterval(criarCoracao,200);


document.addEventListener("click",function(){

for(let i=0;i<10;i++){

criarCoracao();

}

});


function irParaCarta(){

document.getElementById("cartaSection").scrollIntoView({

behavior:"smooth"

});

}

function abrirCarta(){

document.getElementById("carta").style.display="block";

}


function surpresa(){

document.getElementById("msgSurpresa").style.display="block";

for(let i=0;i<40;i++){

criarCoracao();

}

}


const dataInicio = new Date("2024-01-01");

function atualizarTempo(){

const agora = new Date();

const diff = agora - dataInicio;

const dias = Math.floor(diff / (1000*60*60*24));

const horas = Math.floor(diff / (1000*60*60)) % 24;

const minutos = Math.floor(diff / (1000*60)) % 60;

document.getElementById("contador").innerHTML =
dias+" dias "+horas+" horas "+minutos+" minutos ❤️";

}

setInterval(atualizarTempo,1000);
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


/* carta que escreve sozinha */

const textoCartaCompleto = `
Desde o momento que você entrou na minha vida,
tudo começou a fazer mais sentido.

Seu sorriso ilumina meus dias,
sua presença deixa tudo mais leve
e cada momento ao seu lado se torna especial.

Você é uma mulher incrível,
forte, linda e cheia de qualidades que eu admiro muito.

Sou muito grato por ter você comigo
e por poder viver tantos momentos incríveis ao seu lado.

Hoje, no Dia da Mulher,
eu só quero te lembrar o quanto você é importante para mim.

Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️
Eu te amo muito maix que vuxe ❤️



`;

let posicao = 0;

function escreverCarta(){

const elemento = document.getElementById("textoCarta");

if(posicao < textoCartaCompleto.length){

elemento.innerHTML += textoCartaCompleto.charAt(posicao);

posicao++;

setTimeout(escreverCarta,40);

}

}

escreverCarta();


const dataInicio = new Date("2025-10-05");

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
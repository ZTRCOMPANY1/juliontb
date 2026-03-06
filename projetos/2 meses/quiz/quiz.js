let pontos = 0;

function responder(botao, correta){

if(correta){
pontos++;
}

botao.parentElement.querySelectorAll("button").forEach(b=>{
b.disabled = true;
});

}

function resultado(){

let texto="";

if(pontos==3){
texto="Você acertou tudo! ❤️";
}
else if(pontos==2){
texto="Quase perfeito 😄";
}
else{
texto="Não acertou muito 😅";
}

document.getElementById("resultado").innerHTML =
texto + "<br><br>Independente da pontuação, eu sempre vou te amar ❤️";

}


function responder(botao, correta){

const botoes = botao.parentElement.querySelectorAll("button");

botoes.forEach(b=>{
b.disabled = true;
});

if(correta){
botao.classList.add("resposta-selecionada");
pontos++;
}else{
botao.classList.add("resposta-errada");
}

}
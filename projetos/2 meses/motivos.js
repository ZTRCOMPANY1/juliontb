const motivos = [

"Porque seu sorriso ilumina meu dia",
"Porque você me faz rir",
"Porque você sempre me entende",
"Porque você tem um coração incrível",
"Porque você é linda",
"Porque você me faz feliz",
"Porque você me inspira",
"Porque você me apoia",
"Porque você é carinhosa",
"Porque você é especial",

"Porque você me faz sentir amado",
"Porque você ilumina minha vida",
"Porque você é incrível",
"Porque você me escuta",
"Porque você tem um olhar lindo",
"Porque você me faz sentir em casa",
"Porque você é divertida",
"Porque você é gentil",
"Porque você me motiva",
"Porque você me faz querer ser melhor",

"Porque você é única",
"Porque você é minha pessoa favorita",
"Porque você faz meus dias melhores",
"Porque você tem um abraço perfeito",
"Porque você me dá paz",
"Porque você é maravilhosa",
"Porque você me faz sorrir",
"Porque você me entende",
"Porque você é incrível comigo",
"Porque você é minha felicidade",

"Porque você ilumina qualquer lugar",
"Porque você me faz acreditar no amor",
"Porque você me dá carinho",
"Porque você me dá atenção",
"Porque você é meu porto seguro",
"Porque você é meu sonho",
"Porque você é minha alegria",
"Porque você é meu amor",
"Porque você é perfeita para mim",
"Porque você é especial",

"Porque você é maravilhosa comigo",
"Porque você tem um coração lindo",
"Porque você é minha inspiração",
"Porque você faz meu mundo melhor",
"Porque você é tudo para mim",
"Porque você me faz feliz todos os dias",
"Porque você é minha melhor companhia",
"Porque você é incrível",
"Porque você me faz sorrir sem motivo",
"Porque você é minha pessoa favorita",

"Porque você faz meus dias especiais",
"Porque você me faz sentir importante",
"Porque você me faz acreditar em nós",
"Porque você é minha alegria diária",
"Porque você me faz sentir completo",
"Porque você ilumina meus pensamentos",
"Porque você é maravilhosa",
"Porque você me faz sentir amado",
"Porque você é minha felicidade",
"Porque você é incrível",

"Porque você é única",
"Porque você tem um jeito encantador",
"Porque você me faz sorrir",
"Porque você é minha inspiração",
"Porque você faz minha vida melhor",
"Porque você me dá amor",
"Porque você me faz feliz",
"Porque você é especial",
"Porque você é maravilhosa",
"Porque você é meu amor",

"Porque você me faz sentir em paz",
"Porque você é incrível",
"Porque você me entende",
"Porque você é maravilhosa",
"Porque você é minha alegria",
"Porque você é perfeita",
"Porque você me faz sorrir",
"Porque você é meu sonho",
"Porque você me faz feliz",
"Porque você é incrível",

"Porque você é única",
"Porque você é maravilhosa",
"Porque você me inspira",
"Porque você me faz sentir amado",
"Porque você é especial",
"Porque você me faz feliz",
"Porque você é perfeita",
"Porque você ilumina minha vida",
"Porque você é meu amor",
"Porque você é incrível",

"Porque você me faz sorrir",
"Porque você é maravilhosa",
"Porque você é única",
"Porque você me faz feliz",
"Porque você é perfeita",
"Porque você é incrível",
"Porque você ilumina minha vida",
"Porque você me inspira",
"Porque você é meu amor",
"Porque eu amo você",
"Não tem como colocar todos os motivos pq eles são infinitos"
];

const container = document.getElementById("motivos-container");

motivos.forEach((motivo, index) => {

const card = document.createElement("div");
card.className = "motivo-card";

card.innerHTML = `
<h3>Motivo ${index + 1}</h3>
<p>${motivo} ❤️</p>
`;

container.appendChild(card);

});
const htmlMap = $(".d-grid");
const cameraRotação = $(".camera-rotação");

import { Parede } from "./js/Buildings.js";
import { World } from "./js/World.js";
import { Player } from "./js/Player.js";
import { Builder } from "./js/Builder.js";

const keys = { w: false, a: false, s: false, d: false };
const linhas = 10;
const colunas = 10;
const tamanhoCelula = 60;
const tamanhoGap = 2;
let zoom = 4;
let visaoDeCima = false;
let mouseX;
let mouseY;
var eventclientX
var eventclientY
let ultimaCelulaMouse = null;
var celularSobMouse = null;
var anguloAtual = 0; // 0, 90, 180, 270...

htmlMap.css("transform-origin", "0 0");
htmlMap.css("grid-template-columns", `repeat(${colunas}, ${tamanhoCelula}px)`);
htmlMap.css("grid-template-rows", `repeat(${linhas}, ${tamanhoCelula}px)`);
htmlMap.css("gap", `${tamanhoGap}px`);

const world = new World(linhas, colunas, tamanhoCelula, tamanhoGap, htmlMap);
const player = new Player(htmlMap, 10, 0);
const builder = new Builder(player, world, alcanceMouse);
builder.maquinaSelecionada = Parede;

function detectarPiso(x, y) {
    return world.pixelParaGrid(x, y);
}

function alcanceMouse(playerAtual, alvoX, alvoY, alcance) {
    const [playerY, playerX] = detectarPiso(
        playerAtual.x + playerAtual.tamanhoPlayer / 2,
        playerAtual.y + playerAtual.tamanhoPlayer / 2
    );
    const dx = alvoX - playerX;
    const dy = alvoY - playerY;
    return Math.hypot(dx, dy) <= alcance;
}

let ultimoEventoMouse = null;

function atualizarMouse(event) {
    if (event) {
        ultimoEventoMouse = event;
    }

    if (!ultimoEventoMouse) return;

    // Usa o target do último evento conhecido
    const elementoSobMouse = document.elementFromPoint(ultimoEventoMouse.clientX, ultimoEventoMouse.clientY);
    if (!elementoSobMouse) return;

    celularSobMouse = $(elementoSobMouse).closest('.cell');

    if (celularSobMouse.length) {
        const row = parseInt(celularSobMouse.attr('data-row'));
        const col = parseInt(celularSobMouse.attr('data-col'));

        mouseX = (col * tamanhoCelula) + (tamanhoCelula / 2);
        mouseY = (row * tamanhoCelula) + (tamanhoCelula / 2);
    }
}
function atualizarTecla(event, pressionada) {
    const tecla = event.key.toLowerCase();
    if (tecla === "w" || tecla === "arrowup") keys.w = pressionada;
    if (tecla === "a" || tecla === "arrowleft") keys.a = pressionada;
    if (tecla === "s" || tecla === "arrowdown") keys.s = pressionada;
    if (tecla === "d" || tecla === "arrowright") keys.d = pressionada;
}

function moverPlayer() {
   let inputX = 0;
    let inputY = 0;

    if (keys.a) inputX -= 1;
    if (keys.d) inputX += 1;
    if (keys.w) inputY -= 1;
    if (keys.s) inputY += 1;

    const angulo = -anguloAtual * Math.PI / 180;
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    const dx = inputX * cos - inputY * sin;
    const dy = inputX * sin + inputY * cos;

    player.vx = dx;
    player.vy = dy;
    player.movimento();
    atualizarMouse();

    const playerCenterX = player.x + player.tamanhoPlayer / 2;
    const playerCenterY = player.y + player.tamanhoPlayer / 2;

    // A câmera vai para o centro da tela e gira o mundo
    cameraRotação.css("transform", `
        translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0)
        perspective(1000px)
        rotateX(${visaoDeCima ? 0 : 50}deg)
        rotateZ(var(--angulo-mundo, 0deg)) 
    `);

    // O grid apenas puxa o player para o eixo 0,0 e aplica o zoom instantaneamente
    htmlMap.css("transform", `
        scale(${zoom})
        translate3d(${-playerCenterX}px, ${-playerCenterY}px, 0)
    `);
}


function atualizarCelulas() {
    const [playerY, playerX] = detectarPiso(
        player.x + player.tamanhoPlayer / 2,
        player.y + player.tamanhoPlayer / 2
    );
    htmlMap.find(".cell").removeClass("cellPisando");
    htmlMap.find(`.cell[data-row="${playerY}"][data-col="${playerX}"]`).addClass("cellPisando");

    if (ultimaCelulaMouse) {
        ultimaCelulaMouse.removeClass("cellMouse lugarInvalido");
    }

    const [mouseYGrid, mouseXGrid] = detectarPiso(mouseX, mouseY);
    const celulaMouse = celularSobMouse;
    if (!celulaMouse?.length) {
        ultimaCelulaMouse = null;
        return;
    }

    const classeMouse = alcanceMouse(player, mouseXGrid, mouseYGrid, builder.alcance) ? "cellMouse" : "lugarInvalido";
    celulaMouse.addClass(classeMouse);
    ultimaCelulaMouse = celulaMouse;
}

function atualizar() {
    moverPlayer();
    atualizarCelulas();
    requestAnimationFrame(atualizar);
}

$(window).on("keydown", event => atualizarTecla(event, true));
$(window).on("keyup", event => atualizarTecla(event, false));
$(window).on("mousemove", event => atualizarMouse(event));
$(window).on("wheel", event => {
    zoom *= event.originalEvent.deltaY < 0 ? 1.1 : 1 / 1.1;
    zoom = Math.max(0.5, Math.min(zoom, 5));
});
$(window).on("click", () => builder.tentarConstruir(mouseX, mouseY));

mouseX = player.x + player.tamanhoPlayer / 2;
mouseY = player.y + player.tamanhoPlayer / 2;
atualizar();


setInterval(tickMaquinas, 1000);
function tickMaquinas(){
    
}



function atualizarRotacaoSprites() {
    const rotacaoX = visaoDeCima ? 0 : 50;
    const root = document.documentElement;
    root.style.setProperty('--rotacao-texto', `${-rotacaoX}deg`);

    document.querySelectorAll('.sprite-vertical').forEach(el => {
        el.style.transform = `rotateZ(${-anguloAtual}deg) rotateX(${-rotacaoX}deg)`;
    });
}

function girarCamera(direcao) {
    // Se direcao for 'esq' soma 90, se for 'dir' subtrai 90
    htmlMap.addClass("rodandoAnimação");
    anguloAtual += (direcao === 'esq' ? 90 : -90);

    const anguloMundo = `${anguloAtual}deg`;
    const anguloInverso = `${-anguloAtual}deg`;

    // Aplica as variáveis CSS direto no documento ou no container
    const root = document.documentElement;
    root.style.setProperty('--angulo-mundo', anguloMundo);
    root.style.setProperty('--angulo-inverso', anguloInverso);

    atualizarRotacaoSprites();

    // Ouve o exato fim da transição do CSS, seja qual for a duração dela
    console.log("Iniciando animação de rotação...");
}
// Exemplo: apertar Q e E para rodar a câmera
$(window).on('keydown', (e) => {
    if (e.key === 'q') girarCamera('esq');
    if (e.key === 'e') girarCamera('dir');
    if (e.key === 'r') {
        visaoDeCima = !visaoDeCima;
        atualizarRotacaoSprites();
    }
});

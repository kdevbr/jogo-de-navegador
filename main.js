const htmlMap = $("#gameCanvas");
const ctx = htmlMap[0].getContext("2d");
const cameraRotação = $(".camera-rotação");

import { Parede } from "./js/Buildings.js";
import { World } from "./js/World.js";
import { Player } from "./js/Player.js";
import { Builder } from "./js/Builder.js";


const keys = { w: false, a: false, s: false, d: false };
const linhas = 20;
const colunas = 20;
const tamanhoCelula = 60;
const tamanhoGap = 3;
let zoom = 4;
let pixelRatio = 1;
let canvasSize = 0;
let visaoDeCima = false;
let mouseX;
let mouseY;
var eventclientX
var eventclientY
let ultimaCelulaMouse = null;
var celularSobMouse = null;
var anguloAtual = 0; // 0, 90, 180, 270...
var anguloR = 45

htmlMap.css("transform", "none");

function redimensionarCanvas() {
    pixelRatio = window.devicePixelRatio || 1;
    canvasSize = Math.max(window.innerWidth, window.innerHeight) * 2;
    htmlMap[0].width = Math.round(canvasSize * pixelRatio);
    htmlMap[0].height = Math.round(canvasSize * pixelRatio);
    htmlMap[0].style.setProperty("width", "100%", "important");
    htmlMap[0].style.setProperty("height", "100%", "important");
    cameraRotação[0].style.width = `${canvasSize}px`;
    cameraRotação[0].style.height = `${canvasSize}px`;
}

redimensionarCanvas();

var save = JSON.parse(localStorage.getItem("gameSave")) || null;

visaoDeCima = save?.config?.visaoDeCima || false;
anguloAtual = save?.config?.anguloAtual || 0;
zoom = save?.config?.zoom || 4;
console.log(save);

if(save?.config?.anguloAtual) {
    let anguloMundo = `${anguloAtual}deg`;
    let anguloInverso = `${-anguloAtual}deg`;
    let root = document.documentElement;
    root.style.setProperty('--angulo-mundo', anguloMundo);
    root.style.setProperty('--angulo-inverso', anguloInverso);
}

const world = new World(linhas, colunas, tamanhoCelula, tamanhoGap, htmlMap, save?.world || null);
const player = new Player(htmlMap,save?.player?.x || 0,save?.player?.y || 0,world.largura,world.altura);
const builder = new Builder(player, world, alcanceMouse);
builder.maquinaSelecionada = Parede;
window.player = player;
window.world = world;
world.map = save?.world || world.map;
world.gerarArvores();

function atualizarTransformacaoCamera() {
    cameraRotação[0].style.transform = `
        translate3d(-50%, -50%, 0)
        perspective(3000px)
        rotateX(${visaoDeCima ? 0 : anguloR}deg)
        rotateZ(${anguloAtual}deg)
    `;
}
atualizarTransformacaoCamera();

function alcanceMouse(playerAtual, alvoX, alvoY, alcance) {
    const [playerY, playerX] = world.pixelParaGrid(
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

    const rect = htmlMap[0].getBoundingClientRect();
    
// 1. Posição do mouse relativa ao centro da tela
    const rawX = (ultimoEventoMouse.clientX - rect.left) - canvasSize / 2;
    const rawY = (ultimoEventoMouse.clientY - rect.top) - canvasSize / 2;

    // Rotação inversa do ângulo da câmera
    const rad = -anguloAtual * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const screenX = rawX * cos - rawY * sin;
    const screenY = rawX * sin + rawY * cos;

    // 2. Reverte o zoom e soma o centro do Player...
    // 2. Reverte o zoom e soma o centro do Player para achar a coordenada no Mundo
    const playerCenterX = player.x + player.tamanhoPlayer / 2;
    const playerCenterY = player.y + player.tamanhoPlayer / 2;
    const worldMouseX = (screenX / zoom) + playerCenterX;
    const worldMouseY = (screenY / zoom) + playerCenterY;

    // 3. Converte pixels do mundo para coordenadas da célula (grid)
    const passo = tamanhoCelula + tamanhoGap;
    const col = Math.floor(worldMouseX / passo);
    const row = Math.floor(worldMouseY / passo);

    // Salva a posição centralizada da célula apontada
    mouseX = (col * passo) + (tamanhoCelula / 2);
    mouseY = (row * passo) + (tamanhoCelula / 2);
}
function atualizarTecla(event, pressionada) {
    const tecla = event.key.toLowerCase();
    if (tecla === "w" || tecla === "arrowup") keys.w = pressionada;
    if (tecla === "a" || tecla === "arrowleft") keys.a = pressionada;
    if (tecla === "s" || tecla === "arrowdown") keys.s = pressionada;
    if (tecla === "d" || tecla === "arrowright") keys.d = pressionada;
}
function moverPlayer(dt, keys) {
    player.movimento(dt, keys, anguloAtual);
    atualizarMouse();
}

function atualizarCelulas() {
    const playerCenterX = player.x + player.tamanhoPlayer / 2;
    const playerCenterY = player.y + player.tamanhoPlayer / 2;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    ctx.save();
    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-playerCenterX, -playerCenterY);

    const anguloXRad = (visaoDeCima ? 0 : anguloR) * (Math.PI / 180);
    const fatorY = (1 / Math.cos(anguloXRad));
    const anguloCameraRad = anguloAtual * (Math.PI / 180);
    desenharMundo(playerCenterX, playerCenterY, fatorY);




    //console.log("fatorY:", fatorY);

    
    ctx.restore();
}

function desenharMundo(centroX, centroY, fatorY) {
    const margemCelulas = 20;
    const passo = tamanhoCelula + tamanhoGap;
    const metadeTelaX = canvasSize / (2 * zoom);
    const metadeTelaY = canvasSize / (2 * zoom);
    const primeiraColuna = Math.floor((centroX - metadeTelaX) / passo) - margemCelulas;
    const ultimaColuna = Math.ceil((centroX + metadeTelaX) / passo) + margemCelulas;
    const primeiraLinha = Math.floor((centroY - metadeTelaY) / passo) - margemCelulas;
    const ultimaLinha = Math.ceil((centroY + metadeTelaY) / passo) + margemCelulas;

    // Identifica as células do grid
    const [playerY, playerX] = world.pixelParaGrid(player.x + player.tamanhoPlayer / 2, player.y + player.tamanhoPlayer / 2);
    const [mouseYGrid, mouseXGrid] = world.pixelParaGrid(mouseX, mouseY);
    const dentroDoAlcance = alcanceMouse(player, mouseXGrid, mouseYGrid, builder.alcance);

    for (let y = primeiraLinha; y <= ultimaLinha; y++) {
        for (let x = primeiraColuna; x <= ultimaColuna; x++) {
            const pixelX = x * passo;
            const pixelY = y * passo;

            const dentroDoMapa = x >= 0 && x < colunas && y >= 0 && y < linhas;

            // Fundo / Borda
            ctx.fillStyle = dentroDoMapa ? "#2b1704" : "#000000";
            ctx.fillRect(pixelX, pixelY, passo, passo);

            // Cor base do chão
            let corChao = dentroDoMapa ? "#4b300f" : "#000000";



            if (dentroDoMapa) {
                if (x === playerX && y === playerY) {
                    corChao = "#6a4e23"; // Cor da celula que o player está pisando
                } else if (x === mouseXGrid && y === mouseYGrid) {
                    corChao = dentroDoAlcance ? "#3b7a57" : "#8b0000"; // Verde se no alcance, vermelho se inválido
                }
            }

            ctx.fillStyle = corChao;
            ctx.fillRect(pixelX, pixelY, tamanhoCelula, tamanhoCelula);

        }
    }
// 2º LOOP: Junta player e árvores visíveis em uma lista
    const filaDeDesenho = [];

    const angRad = anguloAtual * (Math.PI / 180);
    const cos = Math.cos(angRad);
    const sin = Math.sin(angRad);

    // 2. Calcula a profundidade real na visão da câmera (eixo Y da tela)
    function calcularProfundidadeTela(x, y) {
        return x * sin + y * cos;
    }

    for (let y = primeiraLinha; y <= ultimaLinha; y++) {
        for (let x = primeiraColuna; x <= ultimaColuna; x++) {
            const dentroDoMapa = x >= 0 && x < colunas && y >= 0 && y < linhas;
            const objeto = dentroDoMapa ? world.map[y][x] : null;

            if (objeto) {
                                const pixelX = x * passo;
                const pixelY = y * passo;
                filaDeDesenho.push({
                    yBase: objeto.y + (objeto.tamanho || tamanhoCelula) / 2,
                    desenhar: () => {
                        objeto.atualizar(performance.now());
                        objeto.desenhar(ctx, anguloAtual * (Math.PI / 180), fatorY, objeto.tamanho || tamanhoCelula);

                    }
                });
            }
        }
    }

    // Adiciona o Player na mesma fila
    const direcaoX = player.olhandoPraDireita ? 1 : -1;
    filaDeDesenho.push({
        yBase: player.y + player.tamanhoPlayer / 2,
        desenhar: () => {
            player.desenhar(ctx, anguloAtual * (Math.PI / 180), fatorY, player.tamanhoPlayer, direcaoX);
        }
    });

    // ORDENAÇÃO POR Y: quem está mais ao norte desenha primeiro, quem está ao sul desenha por cima
    filaDeDesenho.sort((a, b) => {
        return calcularProfundidadeTela(a.xBase, a.yBase) - calcularProfundidadeTela(b.xBase, b.yBase);
    });

    // Desenha tudo na ordem correta de profundidade
    filaDeDesenho.forEach(item => item.desenhar());
    
}


let animationState = "idle"; // Estado atual da animação
let totalFramesSprites = 8;
let frameAtualSprite = 0;
let contadorFramesSprite = 0;
let framesPorSprite = 100; // Ajuste este valor para controlar a velocidade da animação

let ultimoTempo = performance.now();
//----------------MAIS IMPORTANTE----------------
function atualizar(tempoAtual) {
const dt = (tempoAtual - ultimoTempo) / 16.666; // Normalizado para ~1 em 60 FPS
    
ultimoTempo = tempoAtual;
player.atualizar(tempoAtual);
    moverPlayer(dt, keys);
    atualizarCelulas();
    requestAnimationFrame(atualizar);
}
//----------------MAIS IMPORTANTE----------------
$(window).on("keydown", event => atualizarTecla(event, true));
$(window).on("keyup", event => atualizarTecla(event, false));
$(window).on("mousemove", event => atualizarMouse(event));
$(window).on("resize", redimensionarCanvas);
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
    const rotacaoX = visaoDeCima ? 0 : 90;
    const root = document.documentElement;
    root.style.setProperty('--rotacao-texto', `${-rotacaoX}deg`);

    document.querySelectorAll('.sprite-vertical').forEach(el => {
        el.style.transform = `rotateZ(${-anguloAtual}deg) rotateX(${-rotacaoX}deg)`;
    });
}
function girarCamera(direcao = null) {
    htmlMap.addClass("rodandoAnimação");
if(direcao === 'esq') {
    anguloAtual += 90;
}
if(direcao === 'dir') {
    anguloAtual -= 90;
}
if(direcao == null) {
    anguloAtual = 0;
}
if(Number.isInteger(direcao)) {
    anguloAtual = direcao;
}



    const anguloMundo = `${anguloAtual}deg`;
    const anguloInverso = `${-anguloAtual}deg`;

    // Aplica as variáveis CSS direto no documento ou no container
    const root = document.documentElement;
    root.style.setProperty('--angulo-mundo', anguloMundo);
    root.style.setProperty('--angulo-inverso', anguloInverso);

    atualizarRotacaoSprites();
    atualizarTransformacaoCamera();

    // Ouve o exato fim da transição do CSS, seja qual for a duração dela
    htmlMap.one('transitionend', () => {
        htmlMap.removeClass("rodandoAnimação");
        console.log("Animação de rotação concluída.");
    });
    console.log("Iniciando animação de rotação...");
}
// Exemplo: apertar Q e E para rodar a câmera
$(window).on('keydown', (e) => {
    e.preventDefault();
    if (e.key === 'q') girarCamera('esq');
    if (e.key === 'e') girarCamera('dir');
    if (e.code === 'KeyR') {
        visaoDeCima = !visaoDeCima;
        atualizarTransformacaoCamera();
        atualizarRotacaoSprites();
    }
});

//setInterval(salvarJogo, 500);
function salvarJogo() {
    localStorage.setItem("gameSave", JSON.stringify({
        player: { x: player.x, y: player.y },
        world: world.map,
        config: {
            visaoDeCima: visaoDeCima,
            anguloAtual: anguloAtual,
            zoom: zoom
        }
    }));
    console.log("Jogo salvo!");
}
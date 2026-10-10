import { Entidade,Construcao,Parede,carregarimagem } from "./Buildings.js";

export class Player extends Entidade {
    constructor(htmlMap, spawnX, spawnY, mapW, mapH) {
        super(spawnX, spawnY, {
    idle: {img: carregarimagem("img/Pawn_Idle.png"), frames: 8, speed: 100},
    walk: {img: carregarimagem("img/Pawn_Run.png"), frames: 6, speed: 100}
});
        this.htmlMap = htmlMap;
        this.x = spawnX;
        this.y = spawnY;
        this.tamanhoPlayer = 200;
        this.vy = 0;
        this.vx = 0;
        this.speed = 5;
        this.mapW = mapW;
        this.mapH = mapH;
    }
movimento(dt = 1, keys, anguloAtual) {
    let inputX = 0;
    let inputY = 0;

    if (keys.a) inputX -= 1;
    if (keys.d) inputX += 1;
    if (keys.w) inputY -= 1;
    if (keys.s) inputY += 1;
    if(inputX > 0) this.olhandoPraEsquerda = false;
    if(inputX < 0) this.olhandoPraEsquerda = true;

    const angulo = -anguloAtual * Math.PI / 180;
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    const dx = inputX * cos - inputY * sin;
    const dy = inputX * sin + inputY * cos;

        this.vx = dx;
        this.vy = dy;

        const len = Math.hypot(this.vx, this.vy);
        let vx = 0;
        let vy = 0;

        if (len > 0) {
            vx = (this.vx / len) * this.speed * dt;
            vy = (this.vy / len) * this.speed * dt;
        }

        if(inputX !== 0 || inputY !== 0){
            this.trocarAnimacao("walk");
        }else{
            this.trocarAnimacao("idle");
        }


const passo = 63;
        const raioTronco = 20;

        // Posição dos pés do jogador
        const peAtualX = this.x + this.tamanhoPlayer / 2;
        const peAtualY = this.y + this.tamanhoPlayer / 2;

        function colideComArvore(testeX, testeY) {
            // Checa um raio de células vizinhas ao redor do pé
            const colInicio = Math.floor((testeX - 40) / passo);
            const colFim = Math.floor((testeX + 40) / passo);
            const rowInicio = Math.floor((testeY - 40) / passo);
            const rowFim = Math.floor((testeY + 40) / passo);

            for (let r = rowInicio; r <= rowFim; r++) {
                for (let c = colInicio; c <= colFim; c++) {
                    const objeto = window.world.map[r]?.[c];
                    if (objeto) {
                        // Base do tronco da árvore (onde ela toca o chão)
                        const troncoX = c * passo + passo / 2;
                        const troncoY = r * passo + passo / 2;

                        if (Math.hypot(testeX - troncoX, testeY - troncoY) < raioTronco) {
                            return true; // Bateu
                        }
                    }
                }
            }
            return false;
        }

        // Move no X se não colidir
        if (!colideComArvore(peAtualX + vx, peAtualY)) {
            this.x = Math.max(0, Math.min(this.mapW - this.tamanhoPlayer, this.x + vx));
        }

        // Move no Y se não colidir (permite deslizar e andar para baixo)
        if (!colideComArvore(peAtualX, peAtualY + vy)) {
            this.y = Math.max(0, Math.min(this.mapH - this.tamanhoPlayer, this.y + vy));
        }
        
    }
}

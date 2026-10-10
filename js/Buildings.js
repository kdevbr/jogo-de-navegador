export class Entidade {
    constructor(x, y, CatalogoDeSprites) {
        this.x = x;
        this.y = y;
        this.CatalogoDeSprites = CatalogoDeSprites;
        this.estadoAtual = "idle";
        this.frameAtual = 0;
        this.ultimoTempo = 0;
        this.olhandoPraEsquerda = true;
    }

    trocarAnimacao(novoEstado) {
        if (this.estadoAtual !== novoEstado && this.CatalogoDeSprites[novoEstado]) {
            this.estadoAtual = novoEstado;
            this.frameAtual = 0;
        }
    }

    atualizar(tempoAtual) {
        const anim = this.CatalogoDeSprites[this.estadoAtual];
        if (!anim || anim.frames <= 1) return;

        if (tempoAtual - this.ultimoTempo > anim.speed) {
            this.frameAtual = (this.frameAtual + 1) % anim.frames;
            this.ultimoTempo = tempoAtual;
        }
    }

desenhar(ctx, anguloCameraRad, fatorY, tamanho) {
        const anim = this.CatalogoDeSprites[this.estadoAtual];
        if (!anim || !anim.img.width) return;

        const frameLargura = anim.img.width / anim.frames;
        const frameAltura = anim.img.height;

ctx.save();
        ctx.translate(this.x + (this.tamanhoPlayer || 60) / 2, this.y + (this.tamanhoPlayer || 60) / 2);
        ctx.rotate(-anguloCameraRad);
        ctx.scale(this.olhandoPraEsquerda ? -1 : 1, fatorY);

        // Se for árvore/objeto no chão, ancora nos pés (-tamanho + 15). Se for player, fica no meio (-tamanho / 2)
        const offsetVertical = this.ancoraBase ? (-tamanho + 15) : (-tamanho / 2);

        ctx.drawImage(
            anim.img,
            this.frameAtual * frameLargura, 0, frameLargura, frameAltura,
            -tamanho / 2, offsetVertical, tamanho, tamanho
        );
        ctx.restore();
    }
}

export class Arvore extends Entidade {
    constructor(x, y) {
        super(x, y, {
            idle: {img: carregarimagem("img/Tree1.png"), frames: 8, speed: 100}
        })
        this.tamanho = 160;
    }
}

export class Construcao extends Entidade {
    constructor(x, y, tipo, CatalogoDeSprites) {
        super(x, y, CatalogoDeSprites);
        this.row = y;
        this.col = x;
        this.tipo = tipo;
        this.vida = 100;
        this.solido = true;
    }
}

export class Parede extends Construcao {
    constructor(x, y) {
        super(x, y, "parede");
    }
}

export function carregarimagem(src) {
    let img = new Image();
    img.src = src;
    return img;
}
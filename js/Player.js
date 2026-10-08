export class Player {
    constructor(htmlMap, spawnX, spawnY) {
        this.htmlMap = htmlMap;
        this.x = spawnX;
        this.y = spawnY;
        this.tamanhoPlayer = 40;
        this.vy = 0;
        this.vx = 0;
        this.speed = 5;
        this.p = $("<div></div>");

        this.materializar();
        this.atualizarLimites();
        $(window).on("resize", () => this.atualizarLimites());
    }

    atualizarLimites() {
        this.mapW = this.htmlMap.width();
        this.mapH = this.htmlMap.height();
    }

    materializar() {
        this.p.css("width", `${this.tamanhoPlayer}px`);
        this.p.css("height", `${this.tamanhoPlayer}px`);
        this.p.css("border", "2px solid red");
        this.p.css("position", "absolute");
        this.atualizarVisual();
        this.htmlMap.append(this.p);
    }

    atualizarVisual() {
        this.p.css("transform", `translate3d(${this.x}px, ${this.y}px, 0)`);
    }

    movimento() {
        const len = Math.hypot(this.vx, this.vy);
        let vx = 0;
        let vy = 0;

        if (len > 0) {
            vx = (this.vx / len) * this.speed;
            vy = (this.vy / len) * this.speed;
        }

        this.x = Math.max(0, Math.min(this.mapW - this.tamanhoPlayer, this.x + vx));
        this.y = Math.max(0, Math.min(this.mapH - this.tamanhoPlayer, this.y + vy));
        this.atualizarVisual();
    }
}

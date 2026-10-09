export class Player {
    constructor(htmlMap, spawnX, spawnY, mapW, mapH) {
        this.htmlMap = htmlMap;
        this.x = spawnX;
        this.y = spawnY;
        this.tamanhoPlayer = 40;
        this.vy = 0;
        this.vx = 0;
        this.speed = 5;
        this.mapW = mapW;
        this.mapH = mapH;
    }
movimento(dt = 1) {
        const len = Math.hypot(this.vx, this.vy);
        let vx = 0;
        let vy = 0;

        if (len > 0) {
            vx = (this.vx / len) * this.speed * dt;
            vy = (this.vy / len) * this.speed * dt;
        }

        this.x = Math.max(0, Math.min(this.mapW - this.tamanhoPlayer, this.x + vx));
        this.y = Math.max(0, Math.min(this.mapH - this.tamanhoPlayer, this.y + vy));
    }
}

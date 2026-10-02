export class Builder {
    constructor(player, world, alcanceMouse) {
        this.player = player;
        this.world = world;
        this.alcance = 2;
        this.maquinaSelecionada = null;
        this.alcanceMouse = alcanceMouse;
    }

    tentarConstruir(mouseX, mouseY) {
        const [y, x] = this.world.pixelParaGrid(mouseX, mouseY);

        if (y < 0 || y >= this.world.linhas || x < 0 || x >= this.world.colunas) {
            return;
        }

        if (this.alcanceMouse(this.player, x, y, this.alcance) && this.world.map[y][x] === null) {
            if (!this.maquinaSelecionada) {
                return;
            }

            const novaMaquina = new this.maquinaSelecionada(y, x);
            this.world.construir(x, y, novaMaquina);
        }
    }
}

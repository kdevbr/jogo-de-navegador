export class Construcao {
    constructor(x, y, tipo) {
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

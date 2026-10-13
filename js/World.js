import { Arvore } from "./Buildings.js";
export class World {
    constructor(linhas, colunas, tamanhoCelula, tamanhoGap, htmlMap) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.tamanhoCelula = tamanhoCelula;
        this.tamanhoGap = tamanhoGap;
        this.passo = tamanhoCelula + tamanhoGap;
        this.AreasConstruidasMaquinas = [];
        this.map = Array.from({ length: linhas }, () => Array(colunas).fill(null));

        this.map.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {

            });
        });

        this.largura = this.colunas * this.tamanhoCelula
            + (this.colunas - 1) * this.tamanhoGap;
        this.altura = this.linhas * this.tamanhoCelula
            + (this.linhas - 1) * this.tamanhoGap;

        this.htmlMap = htmlMap;
    }

    pixelParaGrid(x, y) {
        return [
            Math.floor(y / this.passo),
            Math.floor(x / this.passo)
        ];
    }
    atualizaColRow(col, row) {
    }
    construir(col, row, maquina) {
        this.map[row][col] = maquina;
        this.atualizaColRow(col, row);
    }
    gerarArvores() {
        // Gera árvores aleatórias no mundo
    const simplex = new SimplexNoise(); // Fórmula do ruído
    const escala = 0.8; // Controla o tamanho das manchas de floresta

    for (let row = 0; row < this.linhas; row++) {
        for (let col = 0; col < this.colunas; col++) {
            const ruido = simplex.noise2D(col * escala, row * escala);

            // Valores altos geram florestas densas
            if (ruido > 0.7) {
                const pixelX = col * this.passo;
                const pixelY = row * this.passo;
                this.map[row][col] = new Arvore(pixelX, pixelY);
            }
        }
    }
    }
}
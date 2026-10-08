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
}
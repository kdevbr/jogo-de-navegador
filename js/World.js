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
                const cellElement = $("<div><span>CELULA</span></div>");
                cellElement.addClass("cell");
                cellElement.css("width", `${tamanhoCelula}px`);
                cellElement.css("height", `${tamanhoCelula}px`);
                cellElement.attr("data-row", rowIndex);
                cellElement.attr("data-col", colIndex);
                htmlMap.append(cellElement);
            });
        });

        this.htmlMap = htmlMap;
    }

    pixelParaGrid(x, y) {
        return [
            Math.floor(y / this.passo),
            Math.floor(x / this.passo)
        ];
    }
    atualizaColRow(col, row) {
        this.htmlMap.find(`.cell[data-row="${row}"][data-col="${col}"]`).text("MAQUINA");
    }
    construir(col, row, maquina) {
        this.map[row][col] = maquina;
        this.atualizaColRow(col, row);
    }
}
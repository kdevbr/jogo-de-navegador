# Jogo de Navegador

> Um pequeno mundo visto de cima, uma câmera que gira e espaço suficiente para construir alguma coisa.

![Status](https://img.shields.io/badge/status-pre--alpha-f0b429?style=for-the-badge)
![Versão](https://img.shields.io/badge/versão-0.1.0--prealpha-ef8354?style=for-the-badge)
![Stack](https://img.shields.io/badge/feito%20com-Canvas%20%7C%20JavaScript%20%7C%20CSS-2f6690?style=for-the-badge)

## Sobre o projeto

**Jogo de Navegador** é um protótipo de exploração e construção em um mapa de grid renderizado diretamente em um `<canvas>`. A proposta atual é simples e gostosa de testar: caminhar por um pequeno mundo procedural, contornar árvores, mirar uma célula próxima e começar a ocupar o terreno.

O projeto está em **v0.1.0-prealpha**. Isso significa que a fundação jogável já existe, mas sistemas como economia, máquinas funcionais, interface e progressão ainda estão sendo construídos.

## O que já funciona

- Mundo 20 × 20 com células de 60 px e espaçamento entre elas.
- Geração procedural de árvores usando ruído Simplex.
- Renderização 2D com perspectiva simulada e profundidade por ordenação de objetos.
- Câmera com rotação em passos de 90°.
- Alternância entre visão inclinada e visão de cima.
- Zoom com a roda do mouse.
- Movimento em oito direções com normalização da velocidade diagonal.
- Colisão do jogador com árvores e limites do mapa.
- Sprite animado para parado e correndo.
- Prévia da célula apontada pelo mouse, indicando quando ela está dentro do alcance de construção.
- Base de construção por grid, atualmente preparada para paredes.
- Estrutura inicial de save no `localStorage`.
- Modo de depuração para visualizar áreas de colisão.

## Como jogar

### Executar localmente

Como o jogo usa módulos JavaScript, o navegador precisa carregar os arquivos por um servidor local. Na pasta do projeto, execute uma das opções abaixo:

```bash
# Python
python -m http.server 8000
```

ou:

```bash
# Node.js
npx serve .
```

Depois, abra:

```text
http://localhost:8000
```

Também é possível usar a extensão **Live Server** no VS Code.

### Controles

| Ação | Teclas / entrada |
| --- | --- |
| Mover | `W A S D` ou setas |
| Girar a câmera para a esquerda | `Q` |
| Girar a câmera para a direita | `E` |
| Alternar visão inclinada / de cima | `R` |
| Aproximar ou afastar | Roda do mouse |
| Construir na célula destacada | Clique esquerdo |
| Ativar modo debug | Adicione `?d` à URL |

Exemplo de debug: `http://localhost:8000/?d`

## Como o jogo funciona por dentro

O loop principal em `main.js` atualiza o jogador, recalcula a posição do mouse no mundo, limpa o canvas e redesenha somente a região visível. O mundo é organizado em células, mas os objetos são desenhados em uma fila ordenada pela profundidade relativa à rotação da câmera. Assim, um objeto mais ao sul pode aparecer naturalmente na frente de outro.

```text
main.js
├── cria o canvas, o mundo, o jogador e o construtor
├── converte mouse e teclado para coordenadas do mundo
├── controla câmera, zoom e loop de animação
└── desenha o grid e ordena entidades por profundidade

js/
├── World.js      mapa, conversão pixel/grid e árvores procedurais
├── Player.js     movimento, animação e colisão
├── Builder.js    valida alcance e posiciona construções
└── Buildings.js entidades, sprites, árvores e construções

img/
├── Pawn_Idle.png
├── Pawn_Run.png
├── Tree1.png
└── Stump 1.png
```

## Tecnologias

- **JavaScript ES Modules** para a lógica do jogo.
- **HTML Canvas 2D** para renderização.
- **CSS transforms 3D** para a sensação de câmera inclinada e rotação.
- **Simplex Noise 2.4.0** para a distribuição procedural das árvores.
- **jQuery 3.6.0** para eventos e acesso ao canvas.
- **Bootstrap 5.3.0** carregado no documento para suporte visual futuro.

As dependências externas são carregadas por CDN diretamente em `index.html`, então a primeira execução precisa de acesso à internet.

## Estado atual da pre-alpha

O projeto é intencionalmente experimental. A infraestrutura para construções e salvamento já está desenhada, mas ainda há trabalho antes de virar um sistema completo:

- paredes precisam de sprite e comportamento visual próprio;
- o save está implementado, mas ainda não é acionado automaticamente pelo loop;
- `Stump 1.png` está disponível como asset, porém o corte de árvores ainda não está implementado;
- o sistema de máquinas e recursos ainda é um esqueleto;
- não há HUD, menu ou feedback textual dentro do jogo;
- não há sistema de vida, inventário, objetivos ou progressão.

## Próximos passos

1. Dar identidade visual às construções e conectar suas sprites ao catálogo de entidades.
2. Implementar corte de árvores, coleta e inventário.
3. Transformar construções em máquinas com produção e consumo de recursos.
4. Adicionar HUD, seleção de construção e feedback de ações inválidas.
5. Automatizar salvamento e criar uma ação para limpar/reiniciar o mundo.
6. Melhorar acessibilidade, suporte a telas menores e desempenho do renderizador.

## Estrutura de desenvolvimento

Este é um projeto sem bundler e sem etapa de build: altere os arquivos, recarregue o servidor local e teste no navegador. O ponto de entrada é `index.html`, e o jogo começa em `main.js`.

## Licença

Ainda não há uma licença definida para o projeto.

# Créditos, licenças e proveniência

## Texturas do sistema solar

Os mapas planetários e o mapa dos anéis de Saturno foram adaptados da coleção Solar System Scope / INOVE sob Creative Commons Attribution 4.0 International (CC BY 4.0). A atribuição detalhada, os tamanhos originais e otimizados e as limitações das texturas estão em [`assets/textures/ATTRIBUTIONS.md`](assets/textures/ATTRIBUTIONS.md).

## Imagem microscópica

`assets/images/dividing-cell-fluorescence.jpg` é “Dividing Cell Fluorescence”, de Lamiot, via Wikimedia Commons, sob CC BY-SA 4.0. Crédito, descrição das marcações fluorescentes, licença e referência estão em [`SCIENCE-SOURCES.md`](SCIENCE-SOURCES.md) e junto à imagem no Estúdio de Ciências.

## Dados e referências científicas

O snapshot local da tabela periódica foi derivado do endpoint PubChem PUG REST / NIH. A organização e os símbolos são referenciados à IUPAC. As fontes de Biologia, Neurociência e geometria molecular, com limites das representações, estão documentadas em [`SCIENCE-SOURCES.md`](SCIENCE-SOURCES.md). As páginas funcionam com esses dados locais e não consultam as fontes em cada visita.

## Bibliotecas locais

A página Física usa cópias locais das versões que antes eram solicitadas por CDN:

- **Bootstrap 5.3.3**, código MIT, em `assets/vendor/bootstrap/`; o texto completo da licença acompanha o pacote em `assets/vendor/bootstrap/LICENSE`. Origem: [twbs/bootstrap, versão 5.3.3](https://github.com/twbs/bootstrap/tree/v5.3.3).
- **Bootstrap Icons 1.11.3**, código MIT, em `assets/vendor/bootstrap-icons/`; o texto completo da licença acompanha o pacote em `assets/vendor/bootstrap-icons/LICENSE`. Origem: [twbs/icons, versão 1.11.3](https://github.com/twbs/icons/tree/v1.11.3).

CSS, JavaScript e fontes das duas bibliotecas são servidos pelos caminhos locais do pacote; não há dependência de CDN para renderizar a página Física.

## Arquivos preexistentes

O material original do ZIP recebido foi mantido, salvo correções funcionais documentadas no relatório. O pacote de origem não informa a proveniência/licença individual de todas as fotografias e ilustrações preexistentes. Este arquivo não as reatribui nem declara uma licença nova. Antes de publicar o projeto publicamente, confirme os direitos dos recursos herdados cuja origem não esteja documentada.

## Recursos locais da sala de música

- **Tailwind CSS 3.4.17** foi usado apenas na etapa de compilação; a página carrega `assets/css/music-utilities.css` já compilado, sem o Play CDN em tempo de visita. O código MIT e a origem estão em `assets/vendor/tailwindcss/LICENSE` e [twbs/tailwindcss, v3.4.17](https://github.com/tailwindlabs/tailwindcss/tree/v3.4.17). A configuração e a entrada para recompilar são `tailwind.config.cjs` e `assets/css/music-tailwind.input.css`.
- **Font Awesome Free 6.4.0** fornece os ícones CSS, os arquivos WOFF2 e os fallbacks TTF referenciados pela folha local. O arquivo upstream completo de termos/licenças acompanha `assets/vendor/font-awesome/LICENSE.txt`; origem: [FortAwesome/Font-Awesome, 6.4.0](https://github.com/FortAwesome/Font-Awesome/tree/6.4.0).
- **canvas-confetti 1.6.0** está em `assets/vendor/canvas-confetti/`; a licença MIT acompanha o JavaScript em `assets/vendor/canvas-confetti/LICENSE`. Origem: [canvas-confetti 1.6.0](https://www.jsdelivr.com/package/npm/canvas-confetti?version=1.6.0).
- **Great Vibes, Inter e Playfair Display** são servidas localmente em `assets/fonts/`, somente nos subconjuntos latinos e latino-estendidos necessários à página em português. Os avisos SIL Open Font License acompanham os arquivos em `OFL-Great-Vibes.txt`, `OFL-Inter.txt` e `OFL-Playfair-Display.txt`; origens: [Great Vibes](https://fonts.google.com/specimen/Great+Vibes), [Inter](https://fonts.google.com/specimen/Inter) e [Playfair Display](https://fonts.google.com/specimen/Playfair+Display).



## Fotografias reais adicionadas na edição A16 — 17 de novembro de 2026

As fotografias abaixo substituem imagens ilustradas nos destaques e em Santuários Vivos. As páginas usam os endereços oficiais de imagem das plataformas de origem, com links de crédito visíveis junto às áreas correspondentes. As imagens remotas exigem conexão à internet; o restante do projeto continua local. Não foram alteradas as fotografias pessoais enviadas pelo usuário. As antigas ilustrações decorativas sem uso em runtime foram removidas do pacote para evitar confusão.

- **Jardim / tulipas:** Bernd Dittrich, “Purple blossoms hang over a field of colorful tulips”, Unsplash. [Página e licença](https://unsplash.com/photos/purple-blossoms-hang-over-a-field-of-colorful-tulips-aQo5R0iTrp0).
- **Estufa:** Frédéric LO BRUTTO, “Lush green plants inside a bright greenhouse with large windows”, Unsplash. [Página e licença](https://unsplash.com/photos/lush-green-plants-inside-a-bright-greenhouse-with-large-windows-w3Toc67yQYs).
- **Aquário:** Christian Ang, “A fish tank filled with plants and water”, Unsplash. [Página e licença](https://unsplash.com/photos/a-fish-tank-filled-with-plants-and-water-xtbZ1jnpuEY).
- **Borboleta:** Matheus Queiroz, “Macro photography of black butterfly in flower”, Unsplash. [Página e licença](https://unsplash.com/photos/macro-photography-of-black-butterfly-in-flower-3hXvCSYlEHA).
- **Gato (Milo):** Ahmed, “An orange cat sitting in front of a window”, Unsplash. [Página e licença](https://unsplash.com/photos/an-orange-cat-sitting-in-front-of-a-window-lmf-bPBU62o).
- **Hamster (Pipo):** Zhaoli JIN, “A small hamster sitting on top of a table”, Unsplash. [Página e licença](https://unsplash.com/photos/a-small-hamster-sitting-on-top-of-a-table-cgnDJkzWkTg).
- **Matemática:** Vitaly Gariev, “Hand writing mathematical formulas on a blackboard with chalk”, Unsplash. [Página e licença](https://unsplash.com/photos/hand-writing-mathematical-formulas-on-a-blackboard-with-chalk-0uKaXrG9zaQ).
- **Física / laboratório:** Nathan Rimoux, “Laboratory glassware is seen in a scientific experiment”, Unsplash. [Página e licença](https://unsplash.com/photos/laboratory-glassware-is-seen-in-a-scientific-experiment-H_w_0xZwZ0w).
- **Observatório / telescópio:** Kelly Zhang, “A telescope on a hill at night with stars in the sky”, Unsplash. [Página e licença](https://unsplash.com/photos/a-telescope-on-a-hill-at-night-with-stars-in-the-sky-5SqTxWX-IRw).
- **Sala de música:** Sparsh Paliwal, “A piano and cello on a dimly lit stage”, Unsplash. [Página e licença](https://unsplash.com/photos/a-piano-and-cello-on-a-dimly-lit-stage-VPjGmAzQb2I).
- **Cubo mágico:** Madhurgupta10, “Rubik's cube.jpg”, Wikimedia Commons, CC BY-SA 4.0. [Arquivo e licença](https://commons.wikimedia.org/wiki/File:Rubik%27s_cube.jpg).

As fotografias de Unsplash são utilizadas conforme a licença da plataforma; a imagem do cubo está sob CC BY-SA 4.0 e deve manter atribuição e compartilhamento pela mesma licença quando adaptada.

- **Física / óptica:** Phil Hearing, “Hand holding a prism reflecting light outdoors”, Unsplash. [Página e licença](https://unsplash.com/photos/hand-holding-a-prism-reflecting-light-outdoors-yo1s5gIMPdw).

- **Sala de música (piano e violoncelo):** Sparsh Paliwal, “A piano and cello on a dimly lit stage”, Unsplash. [Página e licença](https://unsplash.com/photos/a-piano-and-cello-on-a-dimly-lit-stage-VPjGmAzQb2I).
- **Sala de música (violino e teclado):** Lorena Kelly, “A violin sitting on top of a piano keyboard”, Unsplash. [Página e licença](https://unsplash.com/photos/a-violin-sitting-on-top-of-a-piano-keyboard-UNdgFN_lGZ8).
- **Sala de música (piano e violino):** Caleb Oquendo, “Man Playing Grand Piano On Stage”, Pexels. [Página e licença](https://www.pexels.com/photo/man-playing-grand-piano-on-stage-3042512/).

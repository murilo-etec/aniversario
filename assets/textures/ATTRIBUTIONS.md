# Créditos e licença — texturas planetárias

As texturas usadas pelo visualizador foram obtidas da biblioteca **Solar System Scope / INOVE**, “Solar Textures”, sob licença [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/): [solarsystemscope.com/textures](https://www.solarsystemscope.com/textures/). Os arquivos locais são derivados dos mapas equiretangulares 2K da coleção: oito superfícies planetárias e a faixa alfa dos anéis de Saturno.

Para o projeto, as imagens foram reduzidas proporcionalmente de 2048 × 1024 para **1024 × 512**; a faixa de Saturno foi reduzida de 2048 × 125 para **1024 × 62**. A proporção, a projeção e o canal alfa do anel foram preservados. O mapa selecionado só é carregado quando a pessoa abre aquele planeta; mapas inativos são liberados da GPU. Isso mantém a aparência nítida no modal e limita o custo de rede e memória em celulares.

A biblioteca informa que seus mapas combinam fontes como dados da NASA e imagens das sondas Messenger, Viking e Cassini e do Hubble, com ajustes de cor e intensidade; áreas sem cobertura podem conter terreno fictício, e as atmosferas dos gigantes gasosos variam no tempo. Portanto, embora usem mapas globais reais como textura visual, as esferas **não estão em escala** e não são ferramentas para medição ou análise científica.

Uma referência independente com mapas da NASA/JPL/Caltech e ressalvas semelhantes sobre alterações e representatividade é o [catálogo JPL Solar System Simulator — Texture Maps](https://space.jpl.nasa.gov/tmaps/).

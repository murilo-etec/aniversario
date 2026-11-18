# Relatório de revisão — Purple Dreams para Alanis

**Atualização:** 16 de novembro de 2026  
**Base:** ZIP original anexado pelo usuário, preservado em cópia de trabalho  
**Formato:** site estático HTML/CSS/JavaScript, com recursos locais  
**Estado:** revisão estática completa das 13 páginas e validação interativa direcionada da astronomia e navegação; WebGL com GPU real e aparelho Android físico ainda não validados.

## Resumo desta revisão

O projeto original foi mantido como base. Mensagens pessoais, fotos, personagens, nomes, páginas, conteúdos, dependências e funcionalidades existentes foram preservados. As alterações funcionais desta rodada ficaram concentradas em `solar.html`, `assets/js/site-navigation.js` e `assets/css/site-navigation.css`, além deste relatório e do `TODO.md`. Não foi feito um redesign completo de cada página nem foram removidos conteúdos pessoais.

### Sistema solar (`solar.html`)

- Corrigido o overflow horizontal causado pela caixa transformada das órbitas animadas. O documento agora recorta o excedente horizontal sem cortar o diagrama circular.
- Reorganizado o hero para telas estreitas e para paisagem curta; testadas larguras de 320, 360, 390, 768, 844 e 1365 px. O controle de movimento e a orientação permanecem dentro da área principal.
- Oito planetas agora começam em fases orbitais distintas. Sol e planetas receberam gradientes e sombreamento mais naturais, mantendo o fundo e a identidade visual Purple Dreams. A escala continua explicitamente ilustrativa, não científica.
- Corrigido o hit-testing: os anéis orbitais não bloqueiam os planetas e um roteador de toque/mouse escolhe o planeta mais próximo, evitando que áreas de toque sobrepostas abram o planeta vizinho. Os oito planetas foram selecionados individualmente em teste de navegador; também foi testado toque em Terra.
- Adicionado controle de pausa/retomada das órbitas. A animação pausa quando o diagrama sai da área visível ou a aba fica oculta e inicia pausada quando o sistema informa `prefers-reduced-motion`.
- Reduzido o número de estrelas no celular (30) e no desktop (68); meteoros não são agendados em abas ocultas ou quando movimento reduzido está ativo.
- O visualizador WebGL não executa mais um shader procedural continuamente enquanto aguarda uma textura. O canvas é redesenhado sob demanda — ao carregar textura, arrastar, redimensionar ou restaurar contexto — com DPR limitado a 1,35. Quando WebGL ou uma textura falham, a página mantém a esfera estática de reserva e informa corretamente que ela não é arrastável.
- A caixa modal usa altura dinâmica (`dvh`), rolagem interna e áreas seguras do dispositivo.

### Navegação e demais páginas

- Corrigido um ciclo do `MutationObserver` na navegação compartilhada: o observador podia reescrever `hidden`/`aria-expanded` em cada callback ao abrir um modal. Agora os atributos só são atualizados quando o estado realmente muda. O abrir/fechar do modal e os menus foram testados no Chromium sem erros.
- O menu global sobe quando há controles flutuantes no canto inferior direito. Em Santuários Vivos, o botão da navegação não se sobrepõe à borboleta-guia nem ao toast nos viewports testados. Na página solar, o botão de ambiência fica no canto inferior esquerdo, separado da navegação global.
- Os conteúdos e a estrutura das outras páginas foram preservados. A auditoria não identificou referências locais ausentes, links internos quebrados ou IDs duplicados.

## Testes realizados nesta revisão

| Teste | Resultado |
|---|---|
| Sintaxe JavaScript (scripts inline e `assets/js`) | 16 blocos/arquivos verificados; 0 erros |
| Parsing CSS (folhas e blocos inline) | 22 folhas/blocos; 0 erros de parsing |
| Resposta HTTP das 13 rotas HTML | 13/13 com HTTP 200 no servidor local |
| IDs duplicados nas páginas HTML | Nenhum encontrado |
| Assets HTML/CSS locais ausentes | Nenhum encontrado |
| Links internos quebrados (decodificando `%20`) | Nenhum encontrado |
| Overflow horizontal de `solar.html` | Nenhum em 320×720, 360×800, 390×844, 768×1024, 1365×900 e 844×390 |
| Planetas e órbitas | 8 planetas presentes; seleção individual por mouse e toque testada |
| Modal planetário | Abertura, fallback estático, fechamento, Escape, foco inicial e retorno de foco testados |
| Navegação | Menu do cabeçalho e menu global abrem/fecham; ciclo do observer corrigido |
| Movimento reduzido | Controle fica pausado/desabilitado conforme a preferência do sistema |
| Santuários Vivos — controles flutuantes | Sem sobreposição entre menu, borboleta-guia e toast em 360×800 e 1365×900 |
| Console e exceções JS no teste Chromium da astronomia | 0 erros no caminho de fallback testado |

A validação interativa da astronomia foi executada em Chromium headless com o HTML, CSS, JavaScript e texturas locais incorporados ao documento de teste. O WebGL foi desativado no teste de fallback, pois o ambiente não disponibilizou um contexto GPU confiável. Portanto, a esfera estática de reserva, o modal, os controles, as seleções e o layout foram testados; **a compilação do shader, o upload das texturas para GPU e a rotação 3D por arraste não foram aprovados nesta sessão**. Os dez WebP da pasta `assets/textures/optimized` foram verificados como arquivos de imagem válidos e permanecem locais no pacote.

## Limitações honestas e próximos testes

- Não houve teste em Motorola/Android físico, iPhone ou tablet físico. Viewports simulados não substituem a validação no aparelho.
- O caminho WebGL com GPU real, upload de texturas, arraste da esfera e restauração de contexto continua pendente. Se o navegador não habilitar WebGL, a página mostra o fallback estático em vez de travar.
- A bateria funcional completa de todos os formulários, botões, áudio, piano, armazenamento local e experiências das outras 12 páginas não foi repetida nesta rodada. A integridade estática dos seus caminhos, assets e scripts foi verificada, mas isso não comprova cada interação.
- Ainda faltam testes prolongados de consumo de bateria/memória, latência do piano e avaliação formal com leitor de tela.

## Como usar

Extraia o ZIP e mantenha a pasta `Aniversario` inteira. Abra `index.html` ou publique essa pasta em hospedagem estática, sem renomear os arquivos nem mover `assets/`. Para uma execução local mais confiável, use um servidor estático (por exemplo, `python3 -m http.server 8000`) dentro da pasta `Aniversario`.

---

# Registro da revisão anterior — Purple Dreams para Alanis

**Data:** 11 de novembro de 2026  
**Formato:** site estático HTML/CSS/JavaScript, com assets locais  
**Estado:** pacote atualizado e auditado estaticamente; validação interativa integral permanece incompleta.

## Escopo e páginas analisadas

O projeto existente foi mantido. A revisão cobriu as 13 rotas HTML previstas e suas referências locais: `index.html`, `page1.html`, `index (2).html`, `solar.html`, `santuarios.html`, `MEMORIAS.HTML`, `MUSICA.HTML`, `laboratorio-ciencias.html`, `fisica.html`, `pagina1_laboratorio_fisica_schrodinger_especial.html`, `chess.html`, `cubo.html` e `jogo.html`.

Todas as rotas receberam a navegação compartilhada e a identidade Purple Dreams quando compatível com a estrutura original. As páginas com mudanças funcionais e recursos mais extensos foram a abertura e o mapa de experiências, o observatório e o sistema solar, Santuários Vivos, Memórias, a sala de Música, Física e o Estúdio de Ciências. Isso não equivale a um redesign visual completo e exclusivo de cada tela: algumas rotas ainda preservam layouts herdados e precisam de uma revisão artística individual.

## Melhorias implementadas

A identidade compartilhada usa roxo profundo `#160B2D`, violeta `#542A91` e lilás `#B99AFF`, com tokens CSS, foco visível, estados de navegação e suporte a movimento reduzido. O menu contextual apresenta 13 destinos, identifica a rota atual e fecha com Escape. O conteúdo principal continua acessível sem descobrir os segredos.

Santuários Vivos reúne jardim, estufa e aquário, ilustrações originais locais, descobertas interativas, a borboleta-guia, interações textuais com Milo e Pipo e um diário fotográfico. O Estúdio de Ciências concentra seis áreas utilizáveis: gráficos de Matemática; ondas em Física; tabela periódica e moléculas em Química; organelas em Biologia; uma curva qualitativa de potencial de ação em Neurociência; e passos de Bubble Sort em Programação. A tabela local contém 118 elementos, e as moléculas são explicitamente tratadas como modelos esquemáticos, não como estruturas em escala.

O visualizador planetário conserva mapas equiretangulares licenciados, carregamento da textura selecionada, estado de erro e visualização de reserva. Nesta rodada, o shader passou a ignorar o ruído procedural quando há mapa real, o canvas redesenha sob demanda para mapas carregados e o fallback animado fica limitado a 30 fps. A página mantém controles para pausa, movimento reduzido e liberação do render ao fechar ou ocultar o diálogo. A compilação e a interação WebGL, porém, não puderam ser confirmadas no navegador headless desta sessão; esse limite está detalhado abaixo.

A sala de Música preserva o piano, os recados e o conteúdo existente. Os recursos antes solicitados por CDN foram incluídos localmente: Tailwind compilado como CSS estático, Font Awesome, canvas-confetti, fontes e dependências Bootstrap usadas por Física. Duas fotos musicais disponíveis foram mantidas em WebP local. A imagem de piano que já retornava 404 foi substituída por uma composição CSS local, sem alterar o título nem a mensagem do cartão. Os arquivos de origem, versões e licenças estão em [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md).

O portal de `jogo.html` foi completado como caminho opcional: a pista deriva de uma data que já existia no observatório e a recompensa reproduz a mensagem secreta original de `page1.html`, sem criar lembranças ou falas pessoais novas. O manual atualizado explica a edição direta do conteúdo HTML, o uso local de fotos e recados e as limitações de armazenamento.

## Problemas encontrados e correções

A identificação textual do site foi padronizada para Alanis e Maninha. A navegação compartilhada estava oculta por regras globais de `nav` em algumas páginas e também atrás da capa de Memórias. O CSS e a detecção de diálogos foram corrigidos para exibir o menu nos estados apropriados e ocultá-lo somente diante de um diálogo ativo.

Música e Física tinham dependências de CDN para recursos de execução. Elas foram empacotadas localmente, e as fontes externas de algumas páginas foram removidas ou auto-hospedadas. A foto quebrada da sala musical deixou de apontar para placeholder remoto. O sistema solar fazia cálculos FBM mesmo quando a textura real já substituía esse resultado e mantinha o redraw contínuo de uma superfície estática; o código agora evita esse trabalho desnecessário. O arquivo `cubo.html` continua sendo o desafio Math Rush existente, não um simulador 3D de cubo mágico.

## Testes realizados

A auditoria estática final confirmou HTTP 200 nas 13 rotas previstas, nenhuma referência local ausente em HTML ou CSS, nenhuma tag de recurso de execução apontando para um host externo e a identificação pública padronizada para Alanis/Maninha. O JavaScript inline de `solar.html` passou em `node --check`; a estrutura do shader foi verificada quanto a delimitadores e à remoção das funções FBM. Isso é verificação de sintaxe/estrutura, não compilação GLSL nem prova de funcionamento do WebGL.

Uma bateria de navegação anterior à última troca de dependências cobriu 13 rotas em quatro larguras de viewport: 52 carregamentos HTTP 200, sem overflow horizontal, e menu global funcional nas 13 rotas. Depois das alterações de Música, foram executados testes direcionados em quatro larguras, com carregamento de assets locais e interações do piano. Também foram exercitados os controles centrais do laboratório científico e o fluxo do portal opcional. Esses resultados não substituem teste em dispositivos físicos nem cobrem todos os botões, persistência ou leitores de tela.

A tentativa de validação interativa mais recente do sistema solar chegou a HTTP 200 e `DOMContentLoaded`, mas o renderer headless consumiu CPU continuamente quando o teste acionou a criação do contexto/canvas WebGL. A execução ficou sem resposta mesmo com movimento reduzido e após a simplificação do shader; os testes foram interrompidos para não prolongar a saturação do ambiente. Portanto, a interação planetária e o fallback visual não são declarados aprovados nesta rodada. A bateria integral de navegador também não foi concluída depois das últimas mudanças.

## Limitações e melhorias pendentes

O briefing pediu uma revisão visual premium de cada página e cobertura científica mais ampla do que o escopo implementado. Geometria 3D, fractais, cálculo, matrizes e probabilidade; simulações completas de mecânica, óptica, eletricidade e termodinâmica; reações e funções orgânicas; DNA, genética, anatomia e microbiologia; cérebro 3D, sinapses e regiões cerebrais; além de editor de código e outras estruturas de dados, ainda não estão implementados como experiências completas. O laboratório é funcional em seis núcleos, mas não substitui essa abrangência.

Também faltam uma validação WebGL em navegador com GPU disponível, uma bateria completa de todos os controles após a versão final, testes em Android/iPhone físicos, medição de latência do piano, auditoria de memória prolongada e avaliação formal por leitor de tela/WCAG. Antes de publicação pública, confirme ainda a licença de cada foto herdada cuja proveniência não acompanha o ZIP recebido. Os dados de fotos, recados e progresso ficam no `localStorage` do navegador e não são sincronizados entre dispositivos.

As moléculas, organelas e curvas são recursos educativos esquemáticos. Os números e símbolos da tabela usam snapshot local derivado do PubChem e a IUPAC é a referência oficial de nomes e símbolos [1] [2]. A curva de potencial de ação é qualitativa: valores de repouso variam entre neurônios e não devem ser interpretados como um padrão universal [3]. A micrografia celular e as descrições de estruturas eucarióticas estão contextualizadas nas fontes documentadas [4]. As formas moleculares e ângulos de ligação seguem a referência didática VSEPR e não estão em escala [5] [6]. As proveniências, limitações científicas e licenças estão detalhadas em [`SCIENCE-SOURCES.md`](SCIENCE-SOURCES.md) e [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md).

## Arquivos de referência do pacote

O guia para abrir, editar e preservar dados está em [`LEIA-ME-ALANIS.txt`](LEIA-ME-ALANIS.txt). A arquitetura e a direção visual estão em [`plan.md`](plan.md), e os critérios ainda parciais permanecem abertos em [`TODO.md`](TODO.md). O site deve ser hospedado a partir da pasta inteira `Aniversario`, preservando nomes de arquivos e caminhos relativos; não foi publicado em uma hospedagem externa.

## Referências

[1]: https://iupac.org/what-we-do/periodic-table-of-elements/ "IUPAC Periodic Table of Elements"
[2]: https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON "PubChem PUG REST periodic table"
[3]: https://openstax.org/books/introduction-to-behavioral-neuroscience/pages/2-4-mechanisms-of-neural-signaling "OpenStax mechanisms of neural signaling"
[4]: https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells "OpenStax Biology 2e eukaryotic cells"
[5]: https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity "OpenStax Chemistry 2e molecular structure and polarity"
[6]: https://www2.chem.wisc.edu/deptfiles/genchem/sstutorial/Text7/Tx73/tx73.html "University of Wisconsin Madison bond angles and molecular shapes"

## Inclusão das três fotografias enviadas — 17 de novembro de 2026

- Adicionadas três fotografias à galeria de `MEMORIAS.HTML`, sem remover os espaços de galeria nem os recursos de upload já existentes.
- As imagens foram convertidas para WebP, mantendo a resolução original, para reduzir o peso de carregamento: `memoria-encontro.webp`, `memoria-parque.webp` e `memoria-turma.webp`.
- Cada imagem recebeu texto alternativo descritivo, carregamento adiado (`loading=lazy`) e legenda. A foto vertical usa `object-fit: contain` para não cortar as pessoas.
- Os três primeiros cartões agora são lembranças permanentes incluídas no site. Os três cartões restantes continuam disponíveis para fotos escolhidas pelo visitante, armazenadas localmente no navegador.
- A abertura da lightbox continua usando os mesmos controles existentes.

### Testes desta atualização

| Teste | Resultado |
|---|---|
| Conversão e leitura dos três WebP | 3/3 válidos |
| Referências locais das três fotos | 3/3 existentes |
| Sintaxe do JavaScript inline de `MEMORIAS.HTML` | Sem erros no `node --check` |
| Estrutura HTML e quantidade de cartões | 6 cartões encontrados |
| Teste de navegador (Chromium) | Não executado: o ambiente bloqueou a navegação local (`ERR_BLOCKED_BY_ADMINISTRATOR`) |

A abertura da lightbox e o comportamento visual no Android ainda precisam de confirmação no navegador/aparelho de destino.


## Revisão de conteúdo e apresentação — 17 de novembro de 2026

- A abertura (`index.html`) recebeu pequenos acentos com emojis de aniversário, flores, ciência e exploração, sem mudar sua identidade roxa.
- `page1.html` ganhou emojis temáticos em pontos de navegação e títulos; a mensagem foi ajustada para enfatizar amizade, irmandade, respeito e interesses compartilhados.
- `MEMORIAS.HTML` agora se apresenta como uma galeria de amizade. A introdução e as legendas foram reescritas em tom não romântico; a galeria recebeu contraste, acabamento e legendas mais claros. As três fotos locais, a lightbox, o upload e o armazenamento do navegador foram preservados.
- Ícones decorativos de coração foram substituídos por estrelas em Memórias e Santuários. A despedida da página solar foi ajustada para destacar conversas e descobertas compartilhadas.
- As formas de tratamento dirigidas à homenageada foram padronizadas como Alanis ou Maninha.
- Validação desta edição: 11 documentos HTML encontrados na raiz do pacote passaram pelo parser; os scripts inline passaram por `node --check`; não foram detectadas referências locais quebradas nem IDs duplicados nessas páginas. A busca textual do conteúdo editorial não encontrou termos explícitos de declaração amorosa ou referências ao nome removido. Não foi feito teste visual em Android físico nesta edição.


## Atualização de conteúdo e experiências — 17 de novembro de 2026

Foi adicionada a identidade A16 como favicon e assinatura acessível em todas as páginas HTML. A página inicial e o mapa tiveram redução de emojis decorativos e receberam uma seção de astronomia com atalhos para o Sistema Solar e o Observatório. O antigo jogo de matemática foi preservado em `math-rush.html`; `cubo.html` agora é uma página independente de introdução ao cubo 3×3, com modelo 3D CSS, orientação por controles, embaralhamento visual e registro de notação. A sala musical foi reescrita com linguagem neutra, removendo frases e ícones de teor romântico. Foi adicionada uma peça instrumental original sintetizada no próprio navegador com Web Audio. O áudio é uma aproximação eletrônica de piano e cordas, não uma gravação de instrumentos acústicos. O cubo é uma demonstração didática de orientação/notação e não um solver nem uma simulação completa das permutações físicas.

Validações desta atualização: revisão textual dos arquivos alterados, verificação de caminhos locais e sintaxe JavaScript inline com Node.js. Não foi realizado teste de áudio em dispositivos físicos nem validação de interação 3D em navegador móvel nesta execução.


## Atualização visual e fotográfica — 17 de novembro de 2026

- A entrada `index.html` agora usa fotografia real de tulipas com crédito visível ao fotógrafo.
- A página `page1.html` recebeu cards editoriais com fotografias, Bootstrap Icons locais e links para Astronomia, Física, Matemática, Cubo Mágico, Ciências, Música, Memórias e Observatório. O atalho de Matemática aponta para `math-rush.html`; o Cubo Mágico permanece em `cubo.html`.
- Em `santuarios.html`, jardim, estufa, aquário, borboleta, gato e hamster foram substituídos por fotografias reais de origem identificada. Milo e Pipo continuam como nomes narrativos; as fotos não são apresentadas como imagens dos animais originais.
- A fotografia da turma na UNICAMP e as outras fotografias pessoais não foram alteradas.
- Bootstrap Icons local foi referenciado em todas as páginas HTML.
- Créditos detalhados e links para as fontes foram adicionados em `ATTRIBUTIONS.md`.

### Limitação importante
O ambiente de edição não teve acesso de rede para baixar e otimizar os binários das novas fotografias. Por isso, as fotografias externas são carregadas diretamente dos endereços oficiais Unsplash/Wikimedia, com créditos visíveis e registrados. Isso mantém as fontes transparentes, mas significa que essas imagens dependem de internet e de disponibilidade dos servidores externos. Não foi possível validar a renderização visual final em navegador real nem no Android físico nesta execução.

## Auditoria complementar de imagens e página inicial — 17 de novembro de 2026

### Mudanças implementadas
- Substituídos os cenários ilustrados em `index.html` e `santuarios.html` por fotografias reais de tulipas, estufa, aquário, borboleta, gato e hamster.
- Substituídas as imagens decorativas da galeria de `MUSICA.HTML` por fotografias reais de piano, violino e violoncelo.
- Removidos do pacote os antigos arquivos ilustrados sem referência em HTML/CSS/JavaScript.
- Redesenhada a grade de experiências de `page1.html`, com fotografias, créditos e Bootstrap Icons locais.
- Incluídos atalhos separados para Astronomia, Física e Matemática; o card de Matemática agora abre `math-rush.html` e o card de Cubo Mágico abre `cubo.html`.
- Adicionadas referências a Bootstrap Icons local em todas as 12 páginas e conferida a presença do símbolo A16 em todas elas.
- Créditos e links de origem foram adicionados a `ATTRIBUTIONS.md` e, nas áreas de fotos, também aparecem visualmente na página.

### Testes estáticos executados nesta rodada
- 12 páginas HTML analisadas.
- 9 scripts inline passaram em `node --check`.
- 6 arquivos JavaScript externos passaram em `node --check`.
- 10 folhas CSS próprias passaram pela análise sintática.
- Referências locais e links internos: nenhum caminho inexistente detectado.
- IDs duplicados: nenhum detectado.
- Bootstrap Icons e marca A16: referências presentes nas 12 páginas.
- Referências às antigas imagens ilustradas `assets/visuals/`: nenhuma referência restante.

### Limitações de validação
- As novas fotografias são carregadas dos endereços oficiais de Unsplash, Pexels e Wikimedia Commons. O ambiente de edição não permitiu baixar os binários para cópias locais; portanto, essas fotos precisam de internet e podem não aparecer offline.
- As páginas de origem das fotografias e os links de crédito foram verificados por pesquisa, mas o carregamento dos arquivos de imagem não foi validado no navegador deste ambiente.
- A inicialização do Chromium foi bloqueada pelo ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`), então não foi possível concluir captura de tela, medição real de overflow visual ou teste interativo em navegador. Android físico também não foi testado.
- Alguns recursos científicos existentes (gráficos, modelos moleculares, esquemas didáticos e o cubo interativo) foram mantidos como visualizações funcionais; não são fotografias decorativas e não devem ser substituídos por fotos sem prejudicar a explicação.
- A proveniência de alguns recursos astronômicos que já estavam no ZIP anterior continua sem identificação individual. Eles foram preservados e não receberam créditos inventados.

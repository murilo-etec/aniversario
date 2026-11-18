# Plano de evolução — Purple Dreams

## Arquitetura e implementação

Manter o site como projeto estático com HTML, CSS e JavaScript nativos, sem backend e sem dependência de rede para bibliotecas de runtime. Preservar as rotas e os dados existentes do ZIP, fotografias, personagens, mensagens e funcionalidades. Consolidar `santuarios.html` como Santuários Vivos e `laboratorio-ciencias.html` como Estúdio de Ciências, mantendo-os como páginas estáticas com folhas e scripts locais em `assets/css/` e `assets/js/`.

Estrutura confirmada: as páginas HTML ficam na raiz; `assets/css/` abriga identidade e CSS local compilado; `assets/js/` contém interações; `assets/images/` contém fotografias pessoais e recursos com contexto; `assets/fonts/` contém fontes auto-hospedadas e licenças; `assets/textures/` contém mapas planetários e créditos; `assets/images/` recebe imagens com licença e contexto; `assets/data/` preserva a fonte JSON local dos elementos; `assets/vendor/` contém Bootstrap, Bootstrap Icons, Font Awesome, Canvas Confetti e licenças; `tailwind.config.cjs` e `assets/css/music-tailwind.input.css` permitem reconstruir as utilidades estáticas da sala de música. O Estúdio de Ciências usa gráficos Canvas 2D, uma tabela local de 118 elementos, modelos moleculares esquemáticos, exploração de organelas, uma curva qualitativa de potencial de ação e Bubble Sort passo a passo. Ele não consulta APIs em tempo de visita nem grava dados pessoais.

A sala de piano deve evoluir dentro do instrumento já existente. O observatório mantém seu código científico e seus dados locais. O visualizador planetário emprega as texturas equiretangulares licenciadas já coletadas e carrega somente a textura solicitada pelo diálogo. Com mapa real carregado, o canvas redesenha sob demanda após interação ou redimensionamento; o fallback procedural usa padrões mais leves e fica limitado a 30 fps, respeitando pausa, `prefers-reduced-motion` e liberação de recursos WebGL. Mapas globais podem incluir preenchimentos ilustrativos e mapas atmosféricos variam com o tempo; a interface deve declarar essa limitação. Na página do observatório, imagens incorporadas só serão extraídas para arquivos relativos depois de confirmar que a mudança preserva pixels, funcionamento e uso local.

O conteúdo pessoal existente permanece intacto e editável nos próprios arquivos, sem geração automática de lembranças. Incluir um guia de localização do conteúdo e da estrutura. Os segredos seguem opcionais e a visitante sempre pode retornar ao mapa de experiências.

## Direção visual

**Movimento:** ilustração botânica cinematográfica combinada a um atlas astronômico e a um laboratório editorial de ciência contemporânea.

**Princípios:** identidade violeta consistente sem homogeneizar as páginas; conteúdo e navegação antes da decoração; um propósito claro por ambiente; feedback, foco de teclado e controles confortáveis.

**Cor:** roxo profundo como cenário, com violeta `#542A91` como assinatura; lilás, rosa delicado, azul celestial e branco suave organizam estados e leitura. Dourado aparece apenas em pequenos destaques importantes.

**Composição:** páginas desenhadas conforme sua função — observatório, jardim, sala de música, jogos e módulos científicos — sem grade única, excesso de cartões ou formas decorativas repetidas. Imagens reais e mapas licenciados convivem com diagramas científicos rotulados e explicitamente esquemáticos.

**Movimento e interação:** animações curtas, com pausa onde fazem sentido; renderização sob demanda; suporte a toque, teclado e `prefers-reduced-motion`. Estados de carregamento, erro, gravação e sucesso devem dar retorno claro.

**Tipografia:** manter Playfair Display nos momentos editoriais e DM Sans/Inter como famílias preferenciais em leitura e controles, com fallback nativo do sistema. Nesta entrega, nenhuma fonte é baixada de serviço externo; garantir contraste e tamanhos confortáveis, inclusive em celular.

**Marca:** Purple Dreams — um presente pessoal autoral, delicado e curioso. Violeta `#542A91` sobre roxo profundo `#160B2D`.

## Ordem de prioridade

1. Preservar e auditar o site existente; corrigir defeitos críticos antes de adicionar efeitos.
2. Aprimorar cada página na sua própria linguagem e tornar o retorno à experiência principal facilmente encontrável.
3. Integrar recursos visuais locais e licenciados; limitar carregamento e memória; comunicar as incertezas das texturas planetárias.
4. Entregar primeiro experiências completas e testadas: novos módulos científicos interativos, controles musicais concretos, funcionalidades do mapa e observatório.
5. Rever acessibilidade, conteúdo pessoal editável, desempenho, armazenamento, links e responsividade em dispositivos reais.
6. Registrar no `TODO.md` e no relatório o que foi implementado, o que foi validado e o que permanece pendente, sem declarar recursos incompletos como concluídos.

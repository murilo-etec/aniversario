# Purple Dreams A16 — atualização visual e interativa

## Alterações
- Cubo mágico refeito como simulador 3D 3×3 com permutações reais das peças nas faces R, L, U, D, F e B.
- Adicionados movimentos horários, inversos e meia-volta, embaralhamento, desfazer, reinicialização e rotação da visualização por arraste/toque.
- Conteúdo didático reorganizado para explicar centros, arestas, cantos e notação.
- Página Santuários recebeu uma coleção botânica com cinco fotografias adicionais e créditos para Unsplash.
- Marcadores decorativos circulares do jardim foram substituídos por pequenos recortes fotográficos interativos.
- Selo geométrico da estufa foi substituído por fotografia; o marcador ornamental do caderno foi substituído por miniatura fotográfica.
- Símbolos de atmosfera substituídos por Bootstrap Icons e elementos de bolhas decorativas removidos.
- Mantidos os conteúdos e funcionalidades existentes fora das áreas alteradas.

## Verificações executadas
- `node --check` no JavaScript inline do cubo: aprovado.
- Tokenização HTML de `cubo.html` e `santuarios.html`: aprovada.
- Parsing de `assets/css/santuarios.css`: aprovado.
- Integridade do arquivo ZIP: executar/confirmar na entrega.

## Limitações
- O ambiente não teve acesso à internet durante a edição; por isso, as novas fotografias externas não puderam ser carregadas para validação visual. Os endereços apontam para imagens do Unsplash e exigem conexão.
- Não foi possível executar teste visual em navegador nem testar toque em aparelho Android nesta sessão.
- O cubo implementa movimentos de face e desfazer, mas não inclui ainda um solucionador automático.

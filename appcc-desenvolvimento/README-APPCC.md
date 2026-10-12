# Guia APPCC — revisão legislativa

Acesso: https://wernermoura2-web.github.io/revisao-guia/appcc-desenvolvimento/html.appc.html?v=12

Arquivos:

- html.appc.html: menu com três opções.
- html.appcc.int.html: formulário interativo completo, sem banco de dados.
- html.appcc.pdf.html: acesso ao modelo PDF de 22 páginas.
- html.appcc.cel.html: instalação no celular.

O formulário reúne 71 indicadores distintos e conserva as avaliações, frases e 58 documentos de apoio de cada grupo da tabela revisada. Permite salvar/abrir JSON, fotografias e rótulos; revisar frases, referências, categorias e pesos; e gerar o PDF preenchido. O JSON é a cópia portátil entre aparelhos.

A instalação usa o manifesto e service worker desta pasta, com escopo restrito a appcc-desenvolvimento. Abra uma vez com internet para preparar o uso offline. A CP 1.365/2025 é utilizada como proposta para testes; confira os requisitos após a publicação do ato definitivo da Anvisa. A metodologia de risco é experimental e sujeita a validação.

Na impressão, as observações preenchem primeiro a coluna esquerda de cima para baixo e depois a direita. Textos excedentes continuam em páginas adicionais. APPCC, revisão de frases/referências e considerandos possuem restauração individual do conteúdo original.

O menu Documentos de apoio permite cadastrar novos documentos, escolher um ou vários itens/frases, permitir ou retirar Não aplicável e editar/restaurar a orientação original. Os vínculos e cadastros acompanham o JSON. Avaliações anteriores continuam guardadas ao mover um documento.

Trabalho em equipe adapta o fluxo do guia de 18 páginas: Gerar arquivo inicial da equipe, Abrir preenchimento, Salvar arquivo e Importar processos. A importação é seletiva por processo, aceita vários arquivos para conferência separada, exige autorização para substituir dados existentes e registra os processos já incorporados. Preserva identificação, anexos e registros gerais do responsável. Códigos de inspeção diferentes são bloqueados; configurações divergentes exigem escolha explícita. O formato de indicadores revisado exige os JSONs deste guia APPCC.

A revisão 2026.10.12.6 fixa as folhas impressas na área A4 para evitar páginas vazias. Processos 7/8 e observações gerais/continuação usam uma coluna; considerações finais usam duas. Medidas e os dois campos separados (fiscalização/envasadora) usam uma coluna. O texto antigo dos participantes é preservado para distribuição manual.

A instalação tem identidade própria APPCC Teste, abertura no Chrome no Android e confirmação pelo instalador do navegador. O cache do aplicativo é preparado separadamente do PDF para que uma falha ao baixar o PDF não impeça a instalação do guia.

A revisão 2026.10.12.7 ajusta as linhas de observação do Controle de Qualidade para manter todas as descrições no modelo de 22 páginas quando medido na largura real A4. Observações extensas continuam sendo preservadas nas páginas de continuação.

A revisão 2026.10.12.8 remove os blocos de referência legal do fim das descrições impressas, preservando as referências no formulário e no editor. Amplia as observações por indicador no Controle de Qualidade (72% da largura da tabela) e reserva espaço nas observações de retornáveis. Nome e endereço aceitam duas linhas no formulário, na impressão e no PDF editável.

O cache recarrega os arquivos atualizados na preparação offline. A criação do aplicativo na lista de apps depende da conclusão da instalação pelo navegador do celular.

A revisão de instalação 9 segue o fluxo do AMESC: captura o evento nativo em um script independente no cabeçalho, antes do código do guia; o botão chama prompt() diretamente durante o toque; o manifesto é solicitado com versão para atualizar a cópia do navegador. A tela de instalação tem um botão principal e apresenta ajuda apenas quando o navegador não disponibiliza a janela nativa. O conteúdo, o PDF, o preenchimento e a impressão do guia permanecem iguais à revisão 2026.10.12.8.

A revisão 2026.10.12.10 usa descrições resumidas na impressão: 82 indicadores e 161 frases, com a primeira frase na mesma linha do indicador, sem espaçamento entre frases. A redação completa continua no formulário; frases personalizadas são impressas integralmente. O PDF conserva 22 páginas e reserva no mínimo 60 mm para as observações de cada página de processos 1 a 6; os processos 7 e 8 têm campos maiores por indicador.

A terceira opção do menu é um botão que chama o instalador, sem ir à página html.appcc.cel.html. O aplicativo não considera que estar em qualquer janela standalone prove instalação do APPCC. Quando aberto dentro da PWA antiga Revisão Guia ou de outro aplicativo no Android, a solicitação abre o Chrome no mesmo menu para obter o instalador nativo; não existe página intermediária de instalação. A janela de confirmação e a conclusão da instalação são controladas pelo navegador.

A revisão 2026.10.12.11 alinha as colunas pela identidade do indicador: recepção com cinco linhas compartilhadas; capacitação e POP de tampas nas linhas equivalentes; controle das tampas em linha própria. Uma resposta Não prevalece sobre Sim, NA e respostas pendentes. Os cinco indicadores de reservatórios são contados apenas uma vez, embora apareçam nas páginas de cada captação. Os identificadores internos dos arquivos JSON, respostas, observações e configurações existentes são preservados.

A impressão usa MODELO PARA IMPRESSÃO no cabeçalho, fonte Poço/Surgência, título Captação depois dos dados da envasadora e o título estadual da avaliação de risco. A matriz mantém verde, amarelo e vermelho; os processos críticos de condução, reservatórios, recepção e higienização são de alto risco abaixo de 100%, conforme o modelo de referência. As linhas iniciais de identificação foram retiradas das páginas de envase, controle de qualidade e responsabilidade. As observações do envase usam uma coluna.

A classificação do estabelecimento exibe os grupos 1, 2 e 3 com os textos do modelo e seleção automática pelo risco calculado. Fotografias e rótulos têm botão Girar 90° no formulário, nas fotos vinculadas às frases e na prévia de impressão; a rotação da prévia atualiza a imagem no guia. Os controles são ocultados ao imprimir.

O modelo PDF mantém 22 páginas editáveis, resultados conjuntos com prioridade de Não e classificação automática em leitores com suporte a JavaScript de formulários, como Acrobat. No HTML, o cálculo e a classificação ficam disponíveis no navegador e são incorporados ao PDF preenchido gerado pela impressão.

A atualização de navegação 12 versiona os links do menu, formulário e PDF para solicitar a cópia atual ao navegador e ao cache offline. O download usa o nome Guia_APPCC_Risco_Corrigido.pdf. A matriz de conteúdo 2026.10.12.11 classifica a faixa 76-99% dos processos 2, 3, 4 e 5 como 3 ALTO, em vermelho.

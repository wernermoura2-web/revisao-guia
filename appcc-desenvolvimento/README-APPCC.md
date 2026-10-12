# Guia APPCC — teste e desenvolvimento

Acesso: https://wernermoura2-web.github.io/revisao-guia/appcc-desenvolvimento/html.appc.html

Arquivos:

- html.appc.html: menu com três opções.
- html.appcc.int.html: formulário interativo completo, sem banco de dados.
- html.appcc.pdf.html: acesso ao modelo PDF de 22 páginas.
- html.appcc.cel.html: instalação no celular.

O formulário contém 82 indicadores, 161 frases e 58 documentos de apoio da tabela revisada. Permite salvar/abrir JSON, fotografias e rótulos; revisar frases, referências, categorias e pesos; e gerar o PDF preenchido. O JSON é a cópia portátil entre aparelhos.

A instalação usa o manifesto e service worker desta pasta, com escopo restrito a appcc-desenvolvimento. Abra uma vez com internet para preparar o uso offline. A CP 1.365/2025 é utilizada como proposta para testes; confira os requisitos após a publicação do ato definitivo da Anvisa. A metodologia de risco é experimental e sujeita a validação.

Na impressão, as observações preenchem primeiro a coluna esquerda de cima para baixo e depois a direita. Textos excedentes continuam em páginas adicionais. APPCC, revisão de frases/referências e considerandos possuem restauração individual do conteúdo original.

O menu Documentos de apoio permite cadastrar novos documentos, escolher um ou vários itens/frases, permitir ou retirar Não aplicável e editar/restaurar a orientação original. Os vínculos e cadastros acompanham o JSON. Avaliações anteriores continuam guardadas ao mover um documento.

Trabalho em equipe adapta o fluxo do guia de 18 páginas: Gerar arquivo inicial da equipe, Abrir preenchimento, Salvar arquivo e Importar processos. A importação é seletiva por processo, aceita vários arquivos para conferência separada, exige autorização para substituir dados existentes e registra os processos já incorporados. Preserva identificação, anexos e registros gerais do responsável. Códigos de inspeção diferentes são bloqueados; configurações divergentes exigem escolha explícita. O formato de indicadores revisado exige os JSONs deste guia APPCC.

A revisão 2026.10.12.6 fixa as folhas impressas na área A4 para evitar páginas vazias. Processos 7/8 e observações gerais/continuação usam uma coluna; considerações finais usam duas. Medidas e os dois campos separados (fiscalização/envasadora) usam uma coluna. O texto antigo dos participantes é preservado para distribuição manual.

A instalação tem identidade própria APPCC Teste, abertura no Chrome no Android e confirmação pelo instalador do navegador. O cache do aplicativo é preparado separadamente do PDF para que uma falha ao baixar o PDF não impeça a instalação do guia.

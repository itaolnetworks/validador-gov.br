# validador-gov.br
Valida assinaturas digitais do gov.br

## Instalação

É necessário o uso do playwright então use o comando npm install playwright e depois atualize os navegadores com o comando npx playwright install
    ```

## Uso

npm validar.js arquivo.pdf

## Retorno

node validar.js arquivo.pdf
▶️ Acessando site...
▶️ Aceitando os termos...
▶️ Tornando o campo de upload visível...
▶️ Enviando o arquivo...
▶️ Clicando no botão validar...
▶️ Aguardando relatório...
▶️ Extraindo informações do relatório...

✅ Dados extraídos:
{
  "nomeArquivo": "arquivo.pdf",
  "hashArquivo": "asssd1f3250e58c1460c9aed695a6asdfd511f1ae406bc92320f3992711731cc",
  "dataValidacao": "28/04/2025 13:01:25 BRT",
  "assinante": null,
  "mensagemValidade": "Assinatura aprovada."
}


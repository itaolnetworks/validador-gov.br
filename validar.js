const { chromium } = require('playwright');
const path = require('path');

async function validarPDF(caminhoDoArquivo) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('▶️ Acessando site...');
    await page.goto('https://validar.iti.gov.br/', { waitUntil: 'domcontentloaded' });

    console.log('▶️ Aceitando os termos...');
    await page.waitForSelector('#acceptTerms', { timeout: 10000 });
    await page.check('#acceptTerms');

    console.log('▶️ Tornando o campo de upload visível...');
    await page.evaluate(() => {
      const fileInput = document.getElementById('signature_files');
      if (fileInput) {
        fileInput.style.display = 'block';
      }
    });

    console.log('▶️ Enviando o arquivo...');
    await page.setInputFiles('#signature_files', caminhoDoArquivo);

    console.log('▶️ Clicando no botão validar...');
    await page.waitForSelector('#validateSignature', { timeout: 10000 });
    await page.click('#validateSignature');

    console.log('▶️ Aguardando relatório...');
    await page.waitForSelector('#nomeArquivo', { timeout: 60000 });

    console.log('▶️ Extraindo informações do relatório...');

    const dadosRelatorio = await page.evaluate(() => {
      return {
        nomeArquivo: document.querySelector('#nomeArquivo')?.innerText || null,
        hashArquivo: document.querySelector('#hashArquivo')?.innerText || null,
        dataValidacao: document.querySelector('#dataValidacao')?.innerText || null,
        assinante: document.querySelector('.assinadoPor')?.nextSibling?.textContent?.trim() || null,
        mensagemValidade: document.querySelector('.frase')?.innerText || null
      };
    });

    console.log('\n✅ Dados extraídos:');
    console.log(JSON.stringify(dadosRelatorio, null, 2));

  } catch (error) {
    console.error('❌ Erro durante a validação:', error);
  } finally {
    await browser.close();
  }
}

// Argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('⚠️  Informe o caminho do arquivo PDF!\nExemplo:\nnode validar.js caminho/para/arquivo.pdf');
  process.exit(1);
}

const caminhoDoArquivo = path.resolve(args[0]);
validarPDF(caminhoDoArquivo);

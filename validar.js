const { chromium } = require('playwright');
const path = require('path');

async function validarPDF(caminhoDoArquivo) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://validar.iti.gov.br/', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#acceptTerms', { timeout: 10000 });
    await page.check('#acceptTerms');

    await page.evaluate(() => {
      const fileInput = document.getElementById('signature_files');
      if (fileInput) {
        fileInput.style.display = 'block';
      }
    });

    await page.setInputFiles('#signature_files', caminhoDoArquivo);

    await page.waitForSelector('#validateSignature', { timeout: 10000 });
    await page.click('#validateSignature');

    const resultado = await Promise.race([
      page.waitForSelector('#nomeArquivo', { timeout: 60000 }).then(() => 'relatorio'),
      page.waitForSelector('#swal2-html-container', { timeout: 60000 }).then(() => 'erro')
    ]);

    if (resultado === 'relatorio') {
      const dadosRelatorio = await page.evaluate(() => {
        return {
          nomeArquivo: document.querySelector('#nomeArquivo')?.innerText || null,
          hashArquivo: document.querySelector('#hashArquivo')?.innerText || null,
          dataValidacao: document.querySelector('#dataValidacao')?.innerText || null,
          assinante: document.querySelector('assinatura .assinadoPor + .espaco')?.innerText || null,
          cpfAssinante: document.querySelector('assinatura .identificador + .espaco')?.innerText || null,
          numeroSerieCertificado: document.querySelector('assinatura .numserie + .espaco')?.innerText || null,
          dataAssinatura: document.querySelector('assinatura .dataDaValidacao + .espaco')?.innerText || null,
          mensagemValidade: document.querySelector('assinatura .frase')?.innerText || null
        };
      });

      const resposta = {
        status: "ok",
        dados: dadosRelatorio
      };

      console.log(JSON.stringify(resposta, null, 2));
      
    } else if (resultado === 'erro') {
      const mensagemErro = await page.$eval('#swal2-html-container', el => el.innerText);

      const resposta = {
        status: "erro",
        mensagem: mensagemErro
      };

      console.log(JSON.stringify(resposta, null, 2));
    }

  } catch (error) {
    const resposta = {
      status: "erro",
      mensagem: "Erro inesperado na validação: " + error.message
    };
    console.log(JSON.stringify(resposta, null, 2));
  } finally {
    await browser.close();
  }
}

// Argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(JSON.stringify({
    status: "erro",
    mensagem: "Nenhum arquivo PDF informado."
  }));
  process.exit(1);
}

const caminhoDoArquivo = path.resolve(args[0]);
validarPDF(caminhoDoArquivo);

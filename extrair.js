const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const matches = [...html.matchAll(/data:image\/png;base64,([^"]+)/g)];

matches.forEach((match, index) => {
  const base64 = match[1];
  const fileName = `assets/imagem${index + 1}.png`;

  fs.writeFileSync(fileName, base64, 'base64');

  console.log(`Criado: ${fileName}`);
});

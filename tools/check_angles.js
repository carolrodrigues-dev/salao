const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'src', 'pages', 'profissionais', 'profissionais.js');
const src = fs.readFileSync(file, 'utf8');
const lines = src.split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lt = (line.match(/</g) || []).length;
  const gt = (line.match(/>/g) || []).length;
  if (gt > lt) console.log(`${i+1}: <${lt} >${gt} | ${line}`);
}
console.log('Done');

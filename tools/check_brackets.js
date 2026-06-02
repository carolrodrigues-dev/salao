const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'src', 'pages', 'profissionais', 'profissionais.js');
const src = fs.readFileSync(file, 'utf8');

function countChars(s, chars) {
  const res = {};
  for (const c of chars) res[c] = 0;
  for (const ch of s) if (res.hasOwnProperty(ch)) res[ch]++;
  return res;
}

const counts = countChars(src, ['{','}','(',')','[',']','<','>']);
console.log('Counts:', counts);

function findMismatch(s) {
  const stack = [];
  const pairs = { '{': '}', '(': ')', '[': ']' };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (pairs[ch]) stack.push({ch, i});
    else if (ch === '}' || ch === ')' || ch === ']') {
      const last = stack.pop();
      if (!last) return {error: 'Unmatched closing', char: ch, index: i};
      if (pairs[last.ch] !== ch) return {error: 'Mismatched', expected: pairs[last.ch], found: ch, index: i};
    }
  }
  if (stack.length) return {error: 'Unclosed opening', char: stack[stack.length-1].ch, index: stack[stack.length-1].i};
  return {ok: true};
}

console.log('Mismatch check:', findMismatch(src));

// show lines around reported index if error
const res = findMismatch(src);
if (res && res.index !== undefined) {
  const lines = src.slice(0, res.index).split(/\r?\n/);
  const lineNo = lines.length;
  const allLines = src.split(/\r?\n/);
  const start = Math.max(0, lineNo-3);
  const end = Math.min(allLines.length, lineNo+2);
  console.log('Context lines', lineNo, start+1, '-', end);
  for (let i = start; i < end; i++) console.log((i+1)+':', allLines[i]);
}

const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /\s*\{\/\* Floating badges \*\/\}[\s\S]*?\+20 Marcas\s*<\/motion\.div>/g;

content = content.replace(regex, '');
fs.writeFileSync('app/page.tsx', content);

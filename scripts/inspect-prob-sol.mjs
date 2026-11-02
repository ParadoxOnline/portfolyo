import fs from 'fs';

const content = fs.readFileSync('src/data/projects.ts', 'utf8');
const flagships = ['lios', 'gen', 'macagel', 'tekstil', 'arama', 'devrim', 'sitebuilder'];

for (const slug of flagships) {
  const idx = content.indexOf(`slug: "${slug}"`);
  const sub = content.slice(idx, idx + 2500);
  const prob = sub.match(/problem:\s*\{([^}]+)\}/);
  const sol = sub.match(/solution:\s*\{([^}]+)\}/);
  console.log(`*** ${slug} ***`);
  console.log('prob:', prob ? prob[1].replace(/\s+/g, ' ').slice(0, 100) : 'none');
  console.log('sol:', sol ? sol[1].replace(/\s+/g, ' ').slice(0, 100) : 'none');
}


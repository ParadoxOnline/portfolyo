import fs from 'fs';

const content = fs.readFileSync('src/data/projects.ts', 'utf8');

const flagships = ['lios', 'gen', 'macagel', 'tekstil', 'arama', 'devrim', 'sitebuilder'];

for (const slug of flagships) {
  const idx = content.indexOf(`slug: "${slug}"`);
  const sub = content.slice(idx, idx + 2000);
  const m1 = sub.match(/shortDescription:\s*\{([^}]+)\}/);
  const m2 = sub.match(/whyItMatters:\s*\{([^}]+)\}/);
  const m3 = sub.match(/solution:\s*\{([^}]+)\}/);
  console.log(`=== ${slug} ===`);
  if (m1) console.log('shortDesc:', m1[1].replace(/\s+/g, ' ').trim());
  if (m2) console.log('whyItMatters:', m2[1].replace(/\s+/g, ' ').trim());
  if (m3) console.log('solution:', m3[1].replace(/\s+/g, ' ').trim());
}


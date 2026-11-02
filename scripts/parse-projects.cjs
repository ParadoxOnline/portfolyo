const fs = require('fs');
const content = fs.readFileSync('src/data/projects.ts', 'utf8');

// Match project definitions
const regex = /{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*missionNumber:\s*"([^"]+)",\s*category:\s*"([^"]+)"[\s\S]*?status:\s*"([^"]+)"[\s\S]*?shortDescription:\s*{\s*en:\s*"([^"]*)"(?:,\s*tr:\s*"([^"]*)")?/g;

const projects = [];
let match;
while ((match = regex.exec(content)) !== null) {
  projects.push({
    slug: match[1],
    name: match[2],
    mission: match[3],
    category: match[4],
    status: match[5],
    descEn: match[6],
    descTr: match[7]
  });
}

console.log(JSON.stringify(projects, null, 2));


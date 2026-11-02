import fs from 'fs';

let p = fs.readFileSync('src/data/projects.ts', 'utf8');

p = p.replace('name: "gen",', 'name: "SentioPulse",');
p = p.replace('name: "Tekstil",', 'name: "VeloDrape 3D",');
p = p.replace('name: "Arama",', 'name: "SearchGrid",');
p = p.replace('name: "Devrim Social Engine",', 'name: "ChronoPost",');
p = p.replace('name: "StaticForge Generator",', 'name: "StaticForge",');

// Supporting
p = p.replace('name: "Otorite",', 'name: "AuthGraph",');
p = p.replace('name: "Pazarlama",', 'name: "LeadCompass",');
p = p.replace('name: "Backlink Engine",', 'name: "RankAutomator",');
p = p.replace('name: "Atahan",', 'name: "DeskReserve",');
p = p.replace('name: "VFS RPA",', 'name: "VisaQueue RPA",');
p = p.replace('name: "YT Producer",', 'name: "CineForge AI",');
p = p.replace('name: "CloudVault Storage",', 'name: "CloudVault",');
p = p.replace('name: "DropCatch Harvester",', 'name: "DataHarvester",');
p = p.replace('name: "ContentForge AI",', 'name: "ContentForge",');
p = p.replace('name: "OSINT Sistem",', 'name: "Argus Intelligence",');
p = p.replace('name: "Sherlock Data API",', 'name: "TraceMap API",');
p = p.replace('name: "VFS AutoPilot RPA",', 'name: "VisaQueue AutoPilot",');

fs.writeFileSync('src/data/projects.ts', p, 'utf8');
console.log('Successfully upgraded project names in projects.ts');


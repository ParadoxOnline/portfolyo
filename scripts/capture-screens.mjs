// Çalışan projelerden headless Chrome ile ekran görüntüsü alır.
// Kullanım: node scripts/capture-screens.mjs
// Çıktı: public/screens/<slug>/N.jpg ve src/data/screens.json
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "screens");
const MANIFEST = path.join(ROOT, "src", "data", "screens.json");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p));

// slug -> yakalanacak URL'ler (çalışan yerel sunucular)
const targets = {
  devrim: ["http://localhost/devrim/"],
  farm: ["http://localhost/farm/"],
  sherlock: ["http://localhost/sherlock/"],
  sitebuilder: ["http://localhost/sitebuilder/"],
  tekstil: ["http://localhost:3002/"],
  arama: ["http://localhost:3003/dashboard"],
  gen: ["http://localhost:3004/"],
  macagel: ["http://localhost/halisaha/web/index.html"],
  lios: ["http://localhost/seo/"],
  "osint-platform": ["http://localhost:3011/"],
};

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};

for (const [slug, urls] of Object.entries(targets)) {
  fs.mkdirSync(path.join(OUT, slug), { recursive: true });
  const saved = [];
  urls.forEach((url, i) => {
    const file = path.join(OUT, slug, `${i + 1}.png`);
    try {
      execFileSync(
        CHROME,
        ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1440,900",
          "--virtual-time-budget=6000", `--screenshot=${file}`, url],
        { stdio: "ignore", timeout: 40000 }
      );
      if (fs.existsSync(file) && fs.statSync(file).size > 8000) saved.push(`/screens/${slug}/${i + 1}.png`);
      else console.log("boş/küçük:", slug, url);
    } catch (e) {
      console.log("hata:", slug, url, e.message);
    }
  });
  if (saved.length) manifest[slug] = saved;
  console.log(slug, saved.length);
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));


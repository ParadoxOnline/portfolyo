<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Üretilen Siteler | SiteBuilder</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            min-height: 100vh;
            padding: 40px 20px;
            color: #f8fafc;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 2rem;
        }
        .empty-state {
            text-align: center;
            padding: 60px;
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            border: 1px dashed rgba(255,255,255,0.2);
        }
        .empty-state p {
            color: #94a3b8;
            margin-top: 16px;
        }
        .site-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
        }
        .site-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 24px;
            transition: all 0.3s ease;
        }
        .site-card:hover {
            transform: translateY(-4px);
            border-color: #6366f1;
        }
        .site-card h3 {
            font-size: 1.25rem;
            margin-bottom: 8px;
        }
        .site-card p {
            color: #94a3b8;
            font-size: 0.875rem;
            margin-bottom: 16px;
        }
        .site-card a {
            display: inline-block;
            background: #6366f1;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.2s;
        }
        .site-card a:hover {
            background: #4f46e5;
        }
        .back-link {
            display: inline-block;
            color: #6366f1;
            text-decoration: none;
            margin-bottom: 24px;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="../admin/" class="back-link">← Admin Panele Dön</a>
        <h1>📁 Üretilen Siteler</h1>
        
        <div id="siteList">
            <!-- Sites will be listed here -->
        </div>
    </div>

    <script>
        // List directories in output folder
        const sites = [];
        
        <?php
        $outputPath = __DIR__;
        $dirs = array_filter(glob($outputPath . '/*'), 'is_dir');
        
        foreach ($dirs as $dir) {
            $name = basename($dir);
            $mtime = filemtime($dir);
            echo "sites.push({ name: '$name', date: new Date($mtime * 1000) });\n";
        }
        ?>
        
        const container = document.getElementById('siteList');
        
        if (sites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 3rem;">📭</div>
                    <p>Henüz üretilmiş site yok.</p>
                    <p>Admin panelden ilk sitenizi oluşturun!</p>
                </div>
            `;
        } else {
            sites.sort((a, b) => b.date - a.date);
            
            container.innerHTML = '<div class="site-grid">' + 
                sites.map(site => `
                    <div class="site-card">
                        <h3>📄 ${site.name}</h3>
                        <p>Oluşturulma: ${site.date.toLocaleDateString('tr-TR')}</p>
                        <a href="${site.name}/index.html" target="_blank">Siteyi Görüntüle →</a>
                    </div>
                `).join('') +
            '</div>';
        }
    </script>
</body>
</html>

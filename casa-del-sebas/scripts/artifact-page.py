# Turns dist-artifact/index.html into the page the claude.ai Artifact publisher
# expects (it adds its own <html>/<head>/<body>), and lists the asset files to
# publish next to it. Usage:
#   npm run build:artifact && python3 scripts/artifact-page.py
import json
import os
import re

html = open('dist-artifact/index.html', encoding='utf-8').read()
head = html.split('<head>', 1)[1].split('</head>', 1)[0]
body = html.split('<body>', 1)[1].split('</body>', 1)[0]
desc = re.search(r'<meta\s+name="description"[\s\S]*?/>', head).group(0)
css = re.search(r'href="\./(assets/[^"]+\.css)"', head).group(1)
js = re.search(r'src="\./(assets/[^"]+\.js)"', head).group(1)
page = '\n'.join([
    '<title>Casa del Sebas</title>',
    desc,
    f'<link rel="stylesheet" href="{css}">',
    body.strip(),
    f'<script type="module" src="{js}"></script>',
])
open('dist-artifact/page.html', 'w', encoding='utf-8').write(page)
files = {f'assets/{n}': f'dist-artifact/assets/{n}' for n in sorted(os.listdir('dist-artifact/assets'))}
print(json.dumps(files))

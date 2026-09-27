"""Recorta el fondo de las fotos reales de producto y las deja listas para la
tienda: fondo transparente, 960×1200 y la prenda centrada, igual que las
fotos 3D. Uso:

    pip install "rembg[cpu]" pillow
    python3 scripts/cutout-photos.py

Lee assets-src/fotos/<id>.(png|jpg|webp) y escribe src/assets/products/<id>.webp
(<id> debe coincidir con el id del producto en src/data/products.js).
"""
import glob
import os

from PIL import Image
from rembg import new_session, remove

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'assets-src', 'fotos')
OUT = os.path.join(ROOT, 'src', 'assets', 'products')
W, H = 960, 1200
FILL = 0.8  # la prenda ocupa como máximo el 80 % del ancho o del alto

session = new_session('isnet-general-use')
for path in sorted(glob.glob(os.path.join(SRC, '*'))):
    pid = os.path.splitext(os.path.basename(path))[0]
    img = Image.open(path).convert('RGB')
    # Las fotos pequeñas se agrandan antes para que el recorte salga limpio.
    if img.height < 900:
        k = 900 / img.height
        img = img.resize((round(img.width * k), 900), Image.LANCZOS)
    cut = remove(img, session=session, post_process_mask=True)
    cut = cut.crop(cut.getbbox())
    k = min(W * FILL / cut.width, H * FILL / cut.height)
    cut = cut.resize((round(cut.width * k), round(cut.height * k)), Image.LANCZOS)
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(cut, ((W - cut.width) // 2, (H - cut.height) // 2 + 20))
    canvas.save(os.path.join(OUT, f'{pid}.webp'), quality=86, method=6)
    print('✓', pid)

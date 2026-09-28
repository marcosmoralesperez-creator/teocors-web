"""Acercamientos para la sección «Detalles», sacados de las fotos reales de
assets-src/fotos/. Uso: python3 scripts/detail-crops.py

Cada recorte es (foto, caja x0, y0, x1, y1 en píxeles de la original) y se
guarda en 960×1200 como src/assets/products/<id>.webp.
"""
import os

from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'assets-src', 'fotos')
OUT = os.path.join(ROOT, 'src', 'assets', 'products')

CROPS = {
    'detail-print': ('bermuda-camo.webp', (280, 1000, 680, 1500)),
    'detail-cords': ('chaqueta-denim.png', (180, 280, 460, 630)),
    'detail-type': ('mujer-bomber-cuadros.webp', (240, 220, 500, 545)),
}

for out_id, (name, box) in CROPS.items():
    img = Image.open(os.path.join(SRC, name)).convert('RGB').crop(box)
    img = img.resize((960, 1200), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    img.save(os.path.join(OUT, f'{out_id}.webp'), quality=86, method=6)
    print('✓', out_id)

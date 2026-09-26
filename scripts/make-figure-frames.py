"""Genera la secuencia de cuadros de la figura (fondo transparente) para el
recorrido con scroll. Uso: python3 scripts/make-figure-frames.py video.mp4

Requiere: pip install opencv-python-headless numpy pillow
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'figure-frames')
CROP = (70, 140, 570, 710)  # x, y, ancho, alto: la figura completa con aire
STEP = 2  # un cuadro de cada dos (122 cuadros)
BG = 12  # el fondo del video es #0c0c0c liso

os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    os.remove(os.path.join(OUT, f))

cap = cv2.VideoCapture(SRC)
i = n = 0
while True:
    ok, frame = cap.read()
    if not ok:
        break
    if i % STEP == 0:
        x, y, w, h = CROP
        f = frame[y : y + h, x : x + w].astype(np.float32)
        m = f.max(axis=2)
        # Fondo = píxeles casi negros conectados con el borde (así los tonos
        # oscuros dentro de la figura no se vuelven huecos).
        near = (m <= BG + 10).astype(np.uint8)
        mask = np.zeros((h + 2, w + 2), np.uint8)
        filled = near.copy()
        for sx, sy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
            if filled[sy, sx] == 1:
                cv2.floodFill(filled, mask, (sx, sy), 2)
        bg = filled == 2
        # Se come 1 px del contorno: el video trae un filo oscuro alrededor de la figura.
        fg = cv2.erode((~bg).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32)
        bg = fg == 0
        # Borde suave: mezcla con la luminancia solo en la franja del contorno.
        soft = np.clip((m - BG) / 30.0, 0, 1)
        edge = cv2.dilate(bg.astype(np.uint8), np.ones((3, 3), np.uint8)) & (~bg)
        alpha = np.where(edge.astype(bool), np.minimum(fg, soft), fg)
        alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
        a = np.maximum(alpha, 1e-3)[..., None]
        rgb = np.clip((f - BG * (1 - alpha[..., None])) / a, 0, 255)
        rgba = np.dstack([rgb[..., ::-1], alpha * 255]).astype(np.uint8)
        Image.fromarray(rgba, 'RGBA').save(os.path.join(OUT, f'f{n:03d}.webp'), quality=72, method=6)
        n += 1
    i += 1
print(n, 'cuadros en', os.path.normpath(OUT))

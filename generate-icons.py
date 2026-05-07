#!/usr/bin/env python3
"""
Genera los iconos PNG del Álbum Mundial 2026 para la PWA.
Usa Pillow para texto nítido y correcto.

Instalar dependencias:
    pip install Pillow

Ejecutar desde la raíz del proyecto:
    python3 generate-icons.py
"""

import os
import sys
import math

# ── Colores del design system ──────────────────────────────
BG_DARK    = (7,   10,  16)
RED        = (227, 30,  36)
BLUE       = (0,   79,  159)
GOLD       = (239, 159, 39)
TEXT_CREAM = (255, 240, 200, 255)


def create_icon_pillow(size, output_path):
    from PIL import Image, ImageDraw, ImageFont

    img  = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = cy = size // 2
    r  = size // 2

    # Fondo circular con cuadrantes
    for y in range(size):
        for x in range(size):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            if dist > r:
                continue

            base = list(BG_DARK) + [255]

            if dx < 0 and dy < 0:
                t = max(0.0, 1.0 - dist / (r * 0.85))
                base[0] = int(base[0] * (1-t) + RED[0] * t * 0.7)
                base[1] = int(base[1] * (1-t) + RED[1] * t * 0.3)
                base[2] = int(base[2] * (1-t) + RED[2] * t * 0.2)

            if dx > 0 and dy > 0:
                t = max(0.0, 1.0 - dist / (r * 0.85))
                base[0] = int(base[0] * (1-t) + BLUE[0] * t)
                base[1] = int(base[1] * (1-t) + BLUE[1] * t * 0.6)
                base[2] = int(base[2] * (1-t) + BLUE[2] * t * 0.8)

            alpha = 255
            if dist > r - 1.5:
                alpha = int(255 * (r - dist) / 1.5)

            base[3] = alpha
            img.putpixel((x, y), tuple(base))

    draw2 = ImageDraw.Draw(img)

    # Texto "26"
    font_size = int(size * 0.48)
    font_bold = None

    font_candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/Library/Fonts/Arial Bold.ttf',
        'C:/Windows/Fonts/arialbd.ttf',
        'C:/Windows/Fonts/impact.ttf',
    ]

    for path in font_candidates:
        if os.path.exists(path):
            try:
                font_bold = ImageFont.truetype(path, font_size)
                break
            except Exception:
                continue

    if font_bold is None:
        font_bold = ImageFont.load_default()

    text = '26'
    bbox = draw2.textbbox((0, 0), text, font=font_bold)
    tw   = bbox[2] - bbox[0]
    th   = bbox[3] - bbox[1]
    tx   = (size - tw) // 2 - bbox[0]
    ty   = (size - th) // 2 - bbox[1] - int(size * 0.03)

    # Sombra
    so = max(1, size // 128)
    draw2.text((tx + so, ty + so), text, font=font_bold, fill=(0, 0, 0, 140))
    # Texto principal
    draw2.text((tx, ty), text, font=font_bold, fill=TEXT_CREAM)

    # Borde dorado
    bw = max(1, size // 40)
    draw2.ellipse([bw, bw, size - bw - 1, size - bw - 1], outline=GOLD + (200,), width=bw)

    img.save(output_path, 'PNG')
    print(f'  OK {output_path} ({size}x{size}) — Pillow')


def create_icon_fallback(size, output_path):
    import struct
    import zlib

    cx = cy = size // 2
    r  = size // 2

    SEGMENTS_2 = [
        (0.05, 0.00, 0.95, 0.12),
        (0.80, 0.05, 0.95, 0.50),
        (0.05, 0.44, 0.95, 0.56),
        (0.00, 0.50, 0.20, 0.95),
        (0.05, 0.88, 0.95, 1.00),
    ]
    SEGMENTS_6 = [
        (0.05, 0.00, 0.95, 0.12),
        (0.00, 0.05, 0.18, 0.50),
        (0.05, 0.44, 0.95, 0.56),
        (0.00, 0.50, 0.18, 0.95),
        (0.80, 0.50, 0.98, 0.95),
        (0.05, 0.88, 0.95, 1.00),
    ]

    text_h  = size * 0.52
    text_w  = size * 0.70
    digit_w = text_w * 0.42
    gap     = text_w * 0.16
    text_x0 = cx - text_w / 2
    text_y0 = cy - text_h / 2 - size * 0.03
    d2_x0   = text_x0
    d6_x0   = text_x0 + digit_w + gap

    def in_segs(px, py, segs, dx0, dy0, dw, dh):
        lx = (px - dx0) / dw
        ly = (py - dy0) / dh
        for x0, y0, x1, y1 in segs:
            if x0 <= lx <= x1 and y0 <= ly <= y1:
                return True
        return False

    pixels = []
    for y in range(size):
        row = []
        for x in range(size):
            dx_c, dy_c = x - cx, y - cy
            dist = math.sqrt(dx_c*dx_c + dy_c*dy_c)

            if dist > r:
                row += [0, 0, 0, 0]
                continue

            bg = list(BG_DARK) + [255]

            if dx_c < 0 and dy_c < 0:
                t = max(0, 1 - dist / (r * 0.85))
                bg[0] = int(bg[0] * (1-t) + RED[0] * t * 0.7)
            if dx_c > 0 and dy_c > 0:
                t = max(0, 1 - dist / (r * 0.85))
                bg[2] = int(bg[2] * (1-t) + BLUE[2] * t * 0.8)

            on_2 = in_segs(x, y, SEGMENTS_2, d2_x0, text_y0, digit_w, text_h)
            on_6 = in_segs(x, y, SEGMENTS_6, d6_x0, text_y0, digit_w, text_h)

            if on_2 or on_6:
                pixel = list(TEXT_CREAM)
            else:
                alpha = 255
                if dist > r - 1.5:
                    alpha = int(255 * (r - dist) / 1.5)
                bg[3] = alpha
                pixel = bg

            row += pixel
        pixels.append(row)

    def png_chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    raw = b''.join(b'\x00' + bytes(row) for row in pixels)
    compressed = zlib.compress(raw, 9)
    sig  = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    png  = sig + png_chunk(b'IHDR', ihdr) + png_chunk(b'IDAT', compressed) + png_chunk(b'IEND', b'')

    with open(output_path, 'wb') as f:
        f.write(png)

    print(f'  OK {output_path} ({size}x{size}) — fallback LCD')


if __name__ == '__main__':
    base  = os.path.dirname(os.path.abspath(__file__))
    sizes = [96, 192, 512]

    try:
        from PIL import Image, ImageDraw, ImageFont
        create_fn = create_icon_pillow
        print('Pillow disponible — alta calidad')
    except ImportError:
        create_fn = create_icon_fallback
        print('Pillow no disponible — modo fallback (pip install Pillow para mejor calidad)')

    print()
    for size in sizes:
        create_fn(size, os.path.join(base, f'icon-{size}.png'))

    print('\nIconos generados.')

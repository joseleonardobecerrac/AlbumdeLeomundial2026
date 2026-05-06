#!/usr/bin/env python3
"""
Genera los iconos PNG del álbum para la PWA.
Requiere: pip install Pillow
Ejecutar desde la raíz del proyecto: python3 generate-icons.py
"""
import struct, zlib, base64, os

def create_png_icon(size, output_path):
    """Crea un PNG simple con el diseño del álbum (sin Pillow)."""
    # Create raw RGBA pixels
    pixels = []
    cx, cy = size // 2, size // 2
    r = size // 2

    for y in range(size):
        row = []
        for x in range(size):
            dx, dy = x - cx, y - cy
            dist = (dx*dx + dy*dy) ** 0.5

            # Outside circle = transparent
            if dist > r:
                row += [0, 0, 0, 0]
                continue

            # Background gradient: dark blue
            bg_r, bg_g, bg_b = 7, 10, 16

            # Red diagonal accent (top-left quadrant)
            if dx < 0 and dy < 0 and abs(dx) < r * 0.7:
                t = 1 - (abs(dx) + abs(dy)) / (r * 1.2)
                bg_r = int(bg_r + (227 - bg_r) * t * 0.6)
                bg_g = int(bg_g + (30 - bg_g) * t * 0.3)
                bg_b = int(bg_b + (36 - bg_b) * t * 0.2)

            # Blue accent (bottom-right)
            if dx > 0 and dy > 0 and abs(dx) < r * 0.7:
                t = 1 - (abs(dx) + abs(dy)) / (r * 1.2)
                bg_r = int(bg_r + (0 - bg_r) * t * 0.3)
                bg_g = int(bg_g + (79 - bg_g) * t * 0.4)
                bg_b = int(bg_b + (159 - bg_b) * t * 0.6)

            # Draw "26" text approximation as bright pixels
            text_x = x - int(cx * 0.55)
            text_y = y - int(cy * 0.45)
            scale = size / 192

            # Simplified "2" shape
            in_2 = False
            if 0 <= text_x <= 45*scale and 0 <= text_y <= 65*scale:
                if text_y < 15*scale:  in_2 = True         # top bar
                elif text_y < 35*scale and text_x > 25*scale: in_2 = True  # right side top
                elif 30*scale < text_y < 45*scale: in_2 = True  # middle
                elif text_y > 50*scale: in_2 = True         # bottom bar

            # Simplified "6" shape (offset right)
            text_x6 = text_x - 50*scale
            in_6 = False
            if 0 <= text_x6 <= 40*scale and 0 <= text_y <= 65*scale:
                if text_y < 15*scale:  in_6 = True         # top bar
                elif text_x6 < 12*scale: in_6 = True       # left side
                elif text_y > 30*scale and text_y < 45*scale: in_6 = True  # middle
                elif text_y > 50*scale: in_6 = True         # bottom

            if in_2 or in_6:
                # White text with golden tint
                row += [255, 240, 200, 255]
            else:
                # Smooth edge anti-alias
                alpha = 255
                if dist > r - 1.5:
                    alpha = int(255 * (r - dist) / 1.5)
                row += [bg_r, bg_g, bg_b, alpha]

        pixels.append(row)

    # Encode as PNG
    def png_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    raw = b''
    for row in pixels:
        raw += b'\x00' + bytes(row)

    compressed = zlib.compress(raw, 9)

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    ihdr = png_chunk(b'IHDR', ihdr_data)
    idat = png_chunk(b'IDAT', compressed)
    iend = png_chunk(b'IEND', b'')

    with open(output_path, 'wb') as f:
        f.write(signature + ihdr + idat + iend)

    print(f"  ✓ {output_path} ({size}×{size})")

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    for size in [96, 192, 512]:
        create_png_icon(size, os.path.join(base, f'icon-{size}.png'))
    print("Iconos generados. Instala Pillow para iconos de mayor calidad: pip install Pillow")

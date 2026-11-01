# Downscale and optimize proof screenshots for the web (originals stay in panda-trading-stack).
import sys, pathlib
from PIL import Image
root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'public/proof')
MAX_W = 1600
for p in sorted(root.rglob('*.png')):
    im = Image.open(p).convert('RGB')
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    im = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    im.save(p, optimize=True)
    print(p.name, im.size, f'{p.stat().st_size // 1024} KB')

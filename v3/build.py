# בונה את index.html של כל סקיצה: src.html + העמודים המשותפים (_pages.html)
import pathlib
d = pathlib.Path(__file__).parent
pages = (d/'_pages.html').read_text()
for k in ('a','b'):
    src = d/k/'src.html'
    if src.exists():
        (d/k/'index.html').write_text(src.read_text().replace('<!--PAGES-->', pages))
        print('built', k)

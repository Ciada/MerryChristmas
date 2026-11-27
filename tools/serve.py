"""Server locale per provare il gioco, senza cache (vedi sempre l'ultima versione dei file).

Uso:  python tools/serve.py            -> http://localhost:5180
      python tools/serve.py --phone    -> raggiungibile dal telefono sulla stessa Wi-Fi
"""
import http.server
import os
import sys

PORT = 5180
HOST = "0.0.0.0" if "--phone" in sys.argv else "127.0.0.1"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCache(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    print(f"Il nostro anno -> http://localhost:{PORT}  (Ctrl+C per fermare)")
    http.server.ThreadingHTTPServer((HOST, PORT), NoCache).serve_forever()

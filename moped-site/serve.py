"""
Local preview server for the moped website.

Run from inside the moped-site folder:
    python serve.py
Then open http://localhost:8000 in your browser.
Press Ctrl+C in the terminal to stop it.
"""
import http.server
import socketserver
import webbrowser

PORT = 8000

handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"Serving at {url}  (Ctrl+C to stop)")
    webbrowser.open(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")

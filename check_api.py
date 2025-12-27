import requests
import time
try:
    # Wait a bit for server startup
    time.sleep(2)
    r = requests.get("http://127.0.0.1:8000/locations/states", timeout=5)
    print(r.status_code)
    print(r.json())
except Exception as e:
    print(e)

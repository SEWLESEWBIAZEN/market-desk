import json
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
MOCK_DIR = BASE_DIR / "mock_data"

def load_json(filename):
    with open(MOCK_DIR / filename, "r") as f:
        return json.load(f)
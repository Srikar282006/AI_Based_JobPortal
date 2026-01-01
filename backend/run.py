from app import create_app
from flask_cors import CORS
import os

app = create_app()

# Allow your Vercel frontend + optional localhost for development
CORS(app, resources={r"/*": {"origins": [
    "https://ai-based-job-portal-six.vercel.app",
    "http://localhost:3000",
    "*"
]}}, supports_credentials=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

from flask import Flask
from flask_jwt_extended import JWTManager
from .extensions import db
from .routes.home import home_bp
from .routes.company import company_bp
from .routes.recommend import recommender_bp
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask_cors import CORS  


jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["JWT_SECRET_KEY"] = "my-wish"
    app.config["UPLOAD_FOLDER"] = "uploads/logos"
    app.config["ALLOWED_EXTENSIONS"] = {"png", "jpg", "jpeg"}

    CORS(
        app,
        resources={r"/*": {
            "origins": [
                "https://ai-based-job-portal-six.vercel.app",
                "http://localhost:3000"
            ]
        }},
        supports_credentials=True
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(home_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(recommender_bp)

    with app.app_context():
        from .models.user import User
        from .models.jobs import Company, Job
        db.create_all()

    return app

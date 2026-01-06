from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app.models.user import User, UserData
from app.models.jobs import Job, user_job, Company
from app.extensions import db, bcrypt, BLACKLIST
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from sqlalchemy import insert
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity,verify_jwt_in_request
from ..models import User
import os

home_bp = Blueprint("home", __name__)



@home_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    language = data.get("language")
    image = data.get("image")  # url OR base64

    if not username or not email or not password:
        return jsonify({"error": "username, email, password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        username=username,
        email=email,
        password=hashed_password,
        image_file=image,
        language=language
    )

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "registration success",
        "userdata": user.to_dict(),
        "token": token
    }), 200




@home_bp.route("/uploads/user_images/<filename>")
def serve_profile_image(filename):
    folder = os.path.join(current_app.root_path, "uploads", "user_images")
    return send_from_directory(folder, filename)



@home_bp.route("/login", methods=["POST"])
def user_login():
    datalog = request.get_json()
    if not datalog:
        return jsonify({"error": "Request must be JSON"}), 400

    email = datalog.get("email")
    password = datalog.get("password")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), 400

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login success",
        "user": user.to_dict(),
        "token": access_token
    }), 200



@home_bp.route("/user/details/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Ensure data is loaded
    data = user.data.to_dict() if user.data else None

    return jsonify({"message": "User found", "user_data": data})



@home_bp.route("/user/data", methods=["POST"])
@jwt_required()
def save_user_data():
    user_id = int(get_jwt_identity())
    skills = request.form.get("skills")
    cover_details = request.form.get("cover_details")
    education = request.form.get("education")
    file = request.files.get("resume_file")

    if not skills or not cover_details or not education:
        return jsonify({"error": "skills, cover_details, education required"}), 400

    # Check if user already has data
    existing = UserData.query.filter_by(user_id=user_id).first()

    resume_path = None

    if file:
        filename = secure_filename(file.filename)
        upload_dir = os.path.join(current_app.root_path, "uploads", "resumes")
        os.makedirs(upload_dir, exist_ok=True)
        file.save(os.path.join(upload_dir, filename))
        resume_path = f"uploads/resumes/{filename}"

    if existing:
        # Update existing data
        existing.skills = skills
        existing.cover_details = cover_details
        existing.education = education
        if resume_path:
            existing.resume_file = resume_path

        db.session.commit()
        return jsonify({"message": "User data updated", "data": existing.to_dict()}), 200

    # Create new
    new_data = UserData(
        skills=skills,
        cover_details=cover_details,
        education=education,
        resume_file=resume_path,
        user_id=user_id
    )

    db.session.add(new_data)
    db.session.commit()

    return jsonify({"message": "User data created", "data": new_data.to_dict()}), 201



@home_bp.route("/uploads/resumes/<filename>")
def serve_resume(filename):
    folder = os.path.join(current_app.root_path, "uploads", "resumes")
    return send_from_directory(folder, filename)



@home_bp.route("/user/<int:id>", methods=["GET"])
@jwt_required()
def get_userdetails(id):
    user = db.get_or_404(UserData, id)
    return jsonify({"message": "data retrieved", "data": user.to_dict()})


@home_bp.route("/userdata/edit", methods=["PUT"])
@jwt_required()
def edit_my_user_data():
    user_id = int(get_jwt_identity())
    user_data = UserData.query.filter_by(user_id=user_id).first()

    if not user_data:
        return jsonify({"error": "User data not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON required"}), 400

    if "skills" in data: user_data.skills = data["skills"]
    if "cover_details" in data: user_data.cover_details = data["cover_details"]
    if "education" in data: user_data.education = data["education"]
    if "resume" in data: user_data.resume_file = data["resume"]

    db.session.commit()

    return jsonify({"message": "Updated", "data": user_data.to_dict()}), 200





@home_bp.route("/fetch/usersdata", methods=["GET"])
def get_alluserdetails():
    users = UserData.query.all()
    users_list = [
        {
            "id": user.id,
            "skills": user.skills,
            "cover_details": user.cover_details,
            "resume_file": user.resume_file,
            "education": user.education
        }
        for user in users
    ]
    return jsonify({"message": "data retrieved", "data": users_list})

@home_bp.route("/user/data/me", methods=["GET"])
@jwt_required()
def get_my_user_data():
    user_id = int(get_jwt_identity())
    user_data = UserData.query.filter_by(user_id=user_id).first()

    if not user_data:
        return jsonify({"user_data": None}), 200

    return jsonify({"user_data": user_data.to_dict()}),200


@home_bp.route("/users/job/<int:id>", methods=["POST"])
@jwt_required()
def post_userjob(id):
    user_id = int(get_jwt_identity())

    job_data = Job.query.filter_by(id=id).first()
    if not job_data:
        return jsonify({"message": "Job Position doesn't exist now"}), 404

    existing = db.session.execute(
        user_job.select().where(
            (user_job.c.user_id == user_id) &
            (user_job.c.job_id == id)
        )
    ).first()

    if existing:
        return jsonify({"message": "Already applied for this job"}), 400

    stmt = insert(user_job).values(user_id=user_id, job_id=id)
    db.session.execute(stmt)
    db.session.commit()

    return jsonify({"message": "Job applied successfully"}), 200





@home_bp.route("/users/applied", methods=["GET"])
@jwt_required()
def get_applied_jobs():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    full_jobs = []
    job_ids = []

    for job in user.applied_jobs:
        job_dict = job.to_dict()  # Job details including skills and applicants

        # Add company info
        if job.company:
            job_dict["company"] = {
                "id": job.company.id,
                "company_name": job.company.company_name,
                "company_email": job.company.company_email,
                "about_company": job.company.about_company,
                "logo_file": job.company.logo_file,
                "website": job.company.website
            }

        full_jobs.append(job_dict)
        job_ids.append(job.id)

    return jsonify({
        "applied_job_ids": job_ids,
        "applied_jobs": full_jobs
    }), 200

@home_bp.route("/upload-resume", methods=["POST", "OPTIONS"])
def upload_resume():

    # 1️⃣ Handle Preflight
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    # 2️⃣ Now require JWT only for POST
    verify_jwt_in_request()

    file = request.files.get("resume_file")
    if not file:
        return jsonify({"error":"resume_file required"}),400

    filename = secure_filename(file.filename)

    upload_dir = os.path.join(current_app.root_path,"uploads","resumes")
    os.makedirs(upload_dir, exist_ok=True)

    file.save(os.path.join(upload_dir, filename))

    return jsonify({"file_path":f"uploads/resumes/{filename}"}),200





# ---------------------- LOGOUT ----------------------
@home_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"message": "Logout successful !"}), 200

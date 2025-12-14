from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app.extensions import db, bcrypt, BLACKLIST
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.models.jobs import Company, Job
from werkzeug.utils import secure_filename
import os

company_bp = Blueprint("company", __name__)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"jpg", "jpeg", "png"}


@company_bp.route("/uploads/company_logos/<filename>")
def serve_company_logo(filename):
    folder = os.path.join(current_app.root_path, "uploads", "company_logos")
    return send_from_directory(folder, filename)


@company_bp.route('/register/company', methods=['POST'])
def register_company():
    company_name = request.form.get("company_name")
    company_email = request.form.get("company_email")
    about_company = request.form.get("about_company")
    password = request.form.get("password")
    website = request.form.get("website")
    file = request.files.get("logo_file")

    if not company_name or not company_email or not password or not about_company:
        return jsonify({"error": "Every field is required"}), 400

    filename = "default_company.png"

    if file:
        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_dir = os.path.join(current_app.root_path, "uploads", "company_logos")
            os.makedirs(upload_dir, exist_ok=True)
            file.save(os.path.join(upload_dir, filename))
        else:
            return jsonify({"error": "Invalid logo format"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    company = Company(
        company_name=company_name,
        company_email=company_email,
        about_company=about_company,
        password=hashed_password,
        website=website,
        logo_file=f"uploads/company_logos/{filename}"
    )

    db.session.add(company)
    db.session.commit()

    token = create_access_token(identity=str(company.id))

    return jsonify({
        "message": "Company Registered Successfully",
        "userdata": company.to_dict(),
        "token": token
    }), 201


@company_bp.route("/company/login", methods=["POST"])
def company_login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    email = data.get("company_email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email & password required"}), 400

    company = Company.query.filter_by(company_email=email).first()

    if not company:
        return jsonify({"error": "Company not found"}), 404

    if not bcrypt.check_password_hash(company.password, password):
        return jsonify({"error": "Invalid password"}), 400

    token = create_access_token(identity=str(company.id))

    return jsonify({
        "message": "Login success",
        "userdata": company.to_dict(),
        "token": token
    }), 200


@company_bp.route("/edit/company/<int:id>", methods=["PUT"])
@jwt_required()
def company_edit(id):
    company_id = int(get_jwt_identity())

    if company_id != id:
        return jsonify({"error": "Unauthorized"}), 403

    company = Company.query.filter_by(id=id).first()
    if not company:
        return jsonify({"error": "Company not found"}), 404

    company_name = request.form.get("company_name") or (request.json.get("company_name") if request.is_json else None)
    about_company = request.form.get("about_company") or (request.json.get("about_company") if request.is_json else None)
    website = request.form.get("website") or (request.json.get("website") if request.is_json else None)
    file = request.files.get("logo_file")

    if company_name:
        company.company_name = company_name
    if about_company:
        company.about_company = about_company
    if website:
        company.website = website

    if file:
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid image type"}), 400

        filename = secure_filename(file.filename)
        upload_dir = os.path.join(current_app.root_path, "uploads", "company_logos")
        os.makedirs(upload_dir, exist_ok=True)
        file.save(os.path.join(upload_dir, filename))
        company.logo_file = f"uploads/company_logos/{filename}"

    db.session.commit()

    return jsonify({
        "message": "Company updated successfully",
        "company": company.to_dict()
    }), 200


@company_bp.route("/jobs/post", methods=["POST"])
@jwt_required()
def company_post():
    company_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    job_title = data.get("job_title")
    job_skills = data.get("job_skills")
    job_description = data.get("job_description")

    if not job_title or not job_skills or not job_description:
        return jsonify({"error": "All fields are required"}), 400

    job_post = Job(
        job_title=job_title,
        job_description=job_description,
        job_skills=job_skills,
        company_id=company_id
    )

    db.session.add(job_post)
    db.session.commit()

    return jsonify({"message": "Job Posted", "data": job_post.to_dict()})


@company_bp.route("/job/edit/<int:id>", methods=["PUT"])
@jwt_required()
def jobposts_edit(id):
    company_id = int(get_jwt_identity())
    data = request.get_json()

    job = Job.query.filter_by(id=id, company_id=company_id).first()
    if not job:
        return jsonify({"error": "Job not found"}), 404

    if "job_title" in data:
        job.job_title = data["job_title"]
    if "job_description" in data:
        job.job_description = data["job_description"]
    if "job_skills" in data:
        job.job_skills = data["job_skills"]

    db.session.commit()

    return jsonify({"message": "Job updated", "job_data": job.to_dict()})


@company_bp.route("/job/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def job_postdelete(id):
    company_id = int(get_jwt_identity())

    job = Job.query.filter_by(id=id, company_id=company_id).first()
    if not job:
        return jsonify({"error": "Job not found"}), 404

    db.session.delete(job)
    db.session.commit()

    return jsonify({"message": "Job deleted"}), 200


@company_bp.route("/job/getall", methods=["GET"])
def job_getall():
    jobs = Job.query.all()
    job_list = [
        {
            "id": job.id,
            "job_title": job.job_title,
            "job_description": job.job_description,
            "job_skills": job.job_skills,
            "company_id": job.company_id,
            "company_name": job.company.company_name,
            "company_logo": f"http://127.0.0.1:5000/uploads/company_logos/{job.company.logo_file}",
            "about_company": job.company.about_company,
        }
        for job in jobs
    ]
    return jsonify({"message": "Jobs fetched", "data": job_list})



@company_bp.route("/job/get/<int:id>", methods=["GET"])
def job_getbyId(id):
    job = Job.query.filter_by(id=id).first()

    if not job:
        return jsonify({"error": "Job not found"}), 404

    return jsonify({"message": "Job Found", "job_detail": job.to_dict(), "company_id": job.company_id,
            "company_name": job.company.company_name,
            "company_logo": f"http://127.0.0.1:5000/uploads/company_logos/{job.company.logo_file}",
            "about_company": job.company.about_company}), 200


@company_bp.route("/job/applicant/<int:id>", methods=["GET"])
@jwt_required()
def get_applicant(id):
    company_id = int(get_jwt_identity())
    job_app = Job.query.filter_by(company_id=company_id, id=id).first()

    if not job_app:
        return jsonify({"message": "job post not found"}), 404

    return jsonify({
        "message": "Job data retrieved",
        "applicants": job_app.to_dict()["applicants"]
    }), 200


@company_bp.route("/company/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"message": "Logout successful"}), 200

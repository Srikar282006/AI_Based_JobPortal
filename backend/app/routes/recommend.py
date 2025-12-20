from flask import Blueprint, jsonify
from app.models.user import UserData
from app.models.jobs import Job
from flask_jwt_extended import jwt_required, get_jwt_identity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import re

recommender_bp = Blueprint("recommder", __name__)

@recommender_bp.route("/recommend/userjobs/<int:id>", methods=["GET"])
@jwt_required()
def recommended_jobs(id):
    jobs = Job.query.all()
    user_id = get_jwt_identity()

    user = UserData.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({"message": "User data not found"}), 404

    def clean_words(s):
        s = s.lower()
        s = re.sub(r"[^a-z0-9]+", " ", s)
        return " ".join(s.split())

    # -------- USER SKILLS --------
    user_skill_list = [clean_words(skill) for skill in user.skills.split(",")]
    user_text = " ".join(user_skill_list)

    # -------- JOB SKILLS --------
    job_texts = []
    for job in jobs:
        if isinstance(job.job_skills, list):
            skills = [clean_words(s) for s in job.job_skills]
        else:
            skills = [clean_words(s) for s in job.job_skills.split(",")]

        job_texts.append(" ".join(skills))

    # -------- TF-IDF --------
    documents = [user_text] + job_texts
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform(documents)

    user_vec = tfidf[0]
    job_vecs = tfidf[1:]
    scores = cosine_similarity(user_vec, job_vecs)[0]

    # -------- RESPONSE --------
    recommendations = []

    for i, score in enumerate(scores):
        job = jobs[i]
        company = job.company

        recommendations.append({
            "job_id": job.id,
            "job_title": job.job_title,
            "job_skills": job.job_skills,
            "job_description": job.job_description,
            "similarity": round(float(score), 4),

            # ✅ COMPANY DETAILS
            "company": {
                "id": company.id,
                "company_name": company.company_name,
                "company_email": company.company_email,
                "about_company": company.about_company,
                "website": company.website,
                "logo_url": f"http://127.0.0.1:5000/{company.logo_file}"
            }
        })

    recommendations.sort(key=lambda x: x["similarity"], reverse=True)
    return jsonify(recommendations), 200




@recommender_bp.route("/recommend/topapplicants/<int:job_id>", methods=["GET"])
@jwt_required()
def recommend_applicants(job_id):
    # Company identity
    company_id = int(get_jwt_identity())
    if not company_id:
        return jsonify({"message": "Please Login!!"}), 400

    # Get job
    job = Job.query.filter_by(id=job_id, company_id=company_id).first()
    if not job:
        return jsonify({"message": "Job post not found"}), 404

    # Extract applicant user_ids safely
    applicants_raw = job.to_dict().get("applicants", [])
    applicants = [a["id"] if isinstance(a, dict) else a for a in applicants_raw]

    if not applicants:
        return jsonify({"message": "No applicants found"}), 200

    # Cleaning
    import re
    def clean_words(s):
        s = s.lower()
        s = re.sub(r"[^a-z0-9]+", " ", s)
        return " ".join(s.split())

    # Job text
    if isinstance(job.job_skills, list):
        job_skill_text = " ".join(clean_words(s) for s in job.job_skills)
    else:
        job_skill_text = " ".join(clean_words(s) for s in job.job_skills.split(","))

    job_text = job_skill_text + " " + clean_words(job.job_description)

    # Applicant texts
    applicant_texts = []
    applicant_objects = []

    for uid in applicants:
        user_data = UserData.query.filter_by(user_id=uid).first()
        if user_data:
            skill_text = " ".join(clean_words(s) for s in user_data.skills.split(","))
            applicant_texts.append(skill_text)
            applicant_objects.append(user_data)

    if not applicant_texts:
        return jsonify([]), 200


    # TF-IDF
    documents = [job_text] + applicant_texts
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform(documents)

    job_vec = tfidf[0]
    applicant_vecs = tfidf[1:]
    scores = cosine_similarity(job_vec, applicant_vecs)[0]

    # Output
    recommendations = []
    for i, score in enumerate(scores):
        recommendations.append({
            "applicant_id": applicant_objects[i].user_id,
            "skills": applicant_objects[i].skills,
            "similarity": round(float(score), 4),
            "resume":applicant_objects[i].resume_file,
            "education":applicant_objects[i].education,
            "cover_details":applicant_objects[i].cover_details

        })

    recommendations.sort(key=lambda x: x["similarity"], reverse=True)
    return jsonify(recommendations)


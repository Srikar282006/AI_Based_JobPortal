from ..extensions import db

user_job = db.Table(
    'user_job',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('job_id', db.Integer, db.ForeignKey('job.id'), primary_key=True),
    db.Column('applied_at', db.DateTime, default=db.func.now())  
)

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(120), unique=True, nullable=False)
    company_email = db.Column(db.String(120), unique=True, nullable=False)
    about_company = db.Column(db.Text, nullable=False)
    logo_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    website = db.Column(db.String(120), nullable=True)

    # Relationship to jobs
    jobs = db.relationship('Job', backref='company', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "company_email": self.company_email,
            "about_company": self.about_company,
            "website": self.website,
            "logo_file": self.logo_file,
            "jobs": [job.to_dict() for job in self.jobs]
        }


class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(120), nullable=False)
    job_skills = db.Column(db.Text, nullable=False)        # comma-separated skills
    job_description = db.Column(db.Text, nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)

    # Many-to-many relationship: users who applied
    applicants = db.relationship('User', secondary=user_job, backref='applied_jobs')

    def to_dict(self):
        return {
            "id": self.id,
            "job_title": self.job_title,
            "job_skills": self.job_skills.split(",") if self.job_skills else [],
            "job_description": self.job_description,
            "company_id": self.company_id,
            "applicants": [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_data": user.data.to_dict() if user.data else None
                }
                for user in self.applicants
            ]
        }


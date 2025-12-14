from ..extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    language=db.Column(db.String(60),nullable=False,default='English')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    


    # One-to-one relationship with UserData
    data = db.relationship('UserData', backref='user', uselist=False)

    # applied_jobs relationship is created via backref from Job.applicants

    def to_dict(self):
        return{
            "id":self.id,
            "username":self.username,
            "email":self.email,
            "image_file":self.image_file,
            "language":self.language,
            "created_at":self.created_at.isoformat(),
            "data":self.data.to_dict() if self.data else None
        }


class UserData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    skills = db.Column(db.String(250), nullable=False)   # comma-separated skills
    cover_details = db.Column(db.Text, nullable=False)
    resume_file = db.Column(db.String(20), nullable=True)
    education = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


    def to_dict(self):
        return{
            "id":self.id,
            "skills":self.skills,
            "cover_details":self.cover_details,
            "resume_file":self.resume_file,
            "education":self.education
        }
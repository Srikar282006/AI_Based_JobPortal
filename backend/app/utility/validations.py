from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional, ValidationError
from flask_wtf.file import FileAllowed, FileField
from app.models.user import User, UserData
from flask_login import current_user
import os


# ============================================================
# 1️⃣ REGISTRATION FORM — Validations Added
# ============================================================
class RegistrationForm(FlaskForm):
    username = StringField(
        'Username',
        validators=[DataRequired(), Length(min=3, max=50)]
    )
    email = StringField(
        'Email',
        validators=[DataRequired(), Email(), Length(max=120)]
    )
    image_file = FileField(
        'Profile Image',
        validators=[Optional(), FileAllowed(['jpg', 'png'], "Only JPG/PNG allowed")]
    )
    password = PasswordField(
        'Password',
        validators=[DataRequired(), Length(min=6, max=60)]
    )
    confirm_password = PasswordField(
        'Confirm Password',
        validators=[DataRequired(), EqualTo('password')]
    )
    submit = SubmitField('Sign Up')

    # --- Validations ---
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already taken.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email already registered.')



# ============================================================
# 2️⃣ LOGIN FORM — Correct validation added
# ============================================================
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

    # Only check if email exists (Not uniqueness)
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is None:
            raise ValidationError("No account found with that email.")



# ============================================================
# 3️⃣ UPDATE ACCOUNT FORM — Validations Added
# ============================================================
class UpdateAccountForm(FlaskForm):
    username = StringField(
        'Username',
        validators=[DataRequired(), Length(min=3, max=50)]
    )
    email = StringField(
        'Email',
        validators=[DataRequired(), Email(), Length(max=120)]
    )
    image_file = FileField(
        'Updated Profile Image',
        validators=[Optional(), FileAllowed(['jpg', 'png'], "Only JPG/PNG allowed")]
    )
    submit = SubmitField('Update')

    # --- Validations ---
    def validate_username(self, username):
        if username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError("Username is already taken by another user.")

    def validate_email(self, email):
        if email.data != current_user.email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError("Email is already in use.")



# ============================================================
# 4️⃣ USER DETAILS FORM — Additional validations added
# ============================================================
class UserDetailForm(FlaskForm):
    skills = StringField('Skills', validators=[Optional(), Length(max=250)])
    cover_details = TextAreaField('Cover Details', validators=[DataRequired(), Length(min=10)])
    resume_file = FileField(
        'Resume Upload',
        validators=[Optional(), FileAllowed(['pdf', 'jpg'], "Only PDF/JPG allowed")]
    )
    education = TextAreaField('Education', validators=[DataRequired(), Length(min=10)])
    submit = SubmitField('Save Details')



# ============================================================
# 5️⃣ EDIT USER FORM — Additional validations added
# ============================================================
class EditUserForm(FlaskForm):
    skills = StringField('Skills', validators=[Optional(), Length(max=250)])
    cover_details = TextAreaField('Cover Details', validators=[Optional(), Length(min=5)])
    education = TextAreaField('Education', validators=[Optional(), Length(min=5)])
    image_file = FileField(
        'Profile Image',
        validators=[Optional(), FileAllowed(['jpg', 'png'], "Only JPG/PNG allowed")]
    )
    submit = SubmitField('Update')



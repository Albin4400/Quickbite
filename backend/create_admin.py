from getpass import getpass
import re

from app import create_app
from models import User, db


app = create_app()

with app.app_context():
    email = input('Account email to promote: ').strip().lower()
    if not re.fullmatch(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', email):
        raise SystemExit('Enter a valid email address.')

    user = User.query.filter_by(email=email).first()
    if user is not None:
        if user.role == 'admin':
            print('This account is already an admin.')
        else:
            user.role = 'admin'
            db.session.commit()
            print('Account promoted to admin. Sign in again to receive an admin token.')
    else:
        name = input('Name for the new admin account: ').strip()
        if not name or len(name) > 100:
            raise SystemExit('Name must be between 1 and 100 characters.')

        password = getpass('Password (at least 6 characters): ')
        if len(password) < 6:
            raise SystemExit('Password must be at least 6 characters.')
        if password != getpass('Confirm password: '):
            raise SystemExit('Passwords do not match.')

        user = User(name=name, email=email, role='admin')
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        print('Admin account created.')

import re
from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'message': 'Invalid JSON request payload'}), 400

    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))

    # Validation
    if not name:
        return jsonify({'message': 'Name is required'}), 400

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'message': 'A valid email address is required'}), 400

    if not password or len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters long'}), 400

    # Duplicate check
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'An account with this email already exists'}), 409

    # Create new user with hashed password
    new_user = User(name=name, email=email)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

    # Generate 7-day JWT access token
    access_token = create_access_token(
        identity=str(new_user.id),
        expires_delta=timedelta(days=7),
        additional_claims={'name': new_user.name, 'email': new_user.email}
    )

    return jsonify({
        'message': 'Registration successful',
        'access_token': access_token,
        'user': new_user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'message': 'Invalid JSON request payload'}), 400

    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Incorrect email or password'}), 401

    # Generate 7-day JWT access token
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(days=7),
        additional_claims={'name': user.name, 'email': user.email}
    )

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'user': user.to_dict()}), 200

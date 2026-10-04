from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt
from flask import jsonify
from models import User

def admin_required(fn):
    """Decorator to ensure the JWT has role 'admin'."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Verify JWT exists
        verify_jwt_in_request()
        claims = get_jwt()
        identity = get_jwt_identity()
        user = User.query.filter_by(id=identity).first()
        if claims.get('role') != 'admin' or user is None or user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper

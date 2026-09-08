import os
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import db, bcrypt
from routes.auth import auth_bp
from routes.food import food_bp

# Load environment variables
load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-quickbite-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-quickbite-jwt-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///quickbite.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    if test_config:
        app.config.update(test_config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS for Angular frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    jwt = JWTManager(app)

    # Custom JWT error handling responses for clarity
    @jwt.unauthorized_loader
    def custom_unauthorized_response(err_str):
        return jsonify({
            'message': 'Missing Authorization Header or Invalid Bearer Token',
            'error': 'authorization_required'
        }), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_response(err_str):
        return jsonify({
            'message': 'Signature verification failed or token is malformed',
            'error': 'invalid_token'
        }), 401

    @jwt.expired_token_loader
    def custom_expired_token_response(jwt_header, jwt_payload):
        return jsonify({
            'message': 'The authentication token has expired. Please log in again.',
            'error': 'token_expired'
        }), 401

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(food_bp)

    # Create tables automatically on startup
    with app.app_context():
        db.create_all()

    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'Welcome to the QuickBite Flask API!',
            'status': 'online',
            'endpoints': {
                'health': '/api/health',
                'register': 'POST /api/auth/register',
                'login': 'POST /api/auth/login',
                'foods': 'GET /api/food (JWT required)'
            },
            'frontend': 'http://localhost:4200'
        }), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'service': 'QuickBite API'}), 200

    return app


app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

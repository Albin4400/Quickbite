import math
import re
from flask import Blueprint, request, jsonify, abort
from models import db, User, Food
from decorators import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


def get_admin_food(food_key):
    match = re.fullmatch(r'admin-(\d+)', food_key)
    if match is None:
        abort(404)
    return Food.query.filter_by(id=int(match.group(1)), source='admin').first_or_404()


# ----------- User Management -----------
@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    # Optional query params: search, role
    search = request.args.get('search', '').strip().lower()
    role_filter = request.args.get('role')
    query = User.query
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )
    if role_filter:
        query = query.filter_by(role=role_filter)
    users = query.all()
    return jsonify({
        'status': 'success',
        'count': len(users),
        'users': [u.to_dict() for u in users]
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def edit_user(user_id):
    data = request.get_json(silent=True) or {}
    user = User.query.get_or_404(user_id)
    if 'name' in data:
        name = data['name']
        if not isinstance(name, str) or not name.strip():
            return jsonify({'message': 'Name cannot be empty'}), 400
        user.name = name.strip()
    if 'role' in data:
        role = data['role']
        if role not in ('admin', 'user'):
            return jsonify({'message': 'Role must be either user or admin'}), 400
        user.role = role
    try:
        db.session.commit()
        return jsonify({'message': 'User updated', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

# ----------- Food Management -----------
@admin_bp.route('/foods', methods=['GET'])
@admin_required
def list_admin_foods():
    # Optional filters: search, category, source (admin only here)
    search = request.args.get('search', '').strip().lower()
    category = request.args.get('category')
    query = Food.query.filter_by(source='admin')
    if search:
        query = query.filter(Food.name.ilike(f"%{search}%"))
    if category:
        query = query.filter_by(category=category)
    foods = query.all()
    return jsonify({
        'status': 'success',
        'count': len(foods),
        'foods': [f.to_dict() for f in foods]
    }), 200

@admin_bp.route('/foods', methods=['POST'])
@admin_required
def create_admin_food():
    data = request.get_json(silent=True) or {}
    required = ['name', 'price', 'category']
    missing = [
        key for key in required
        if key not in data or data[key] is None or (isinstance(data[key], str) and not data[key].strip())
    ]
    if missing:
        return jsonify({'message': f"Missing fields: {', '.join(missing)}"}), 400
    if not isinstance(data['name'], str) or not isinstance(data['category'], str):
        return jsonify({'message': 'Name and category must be text values'}), 400
    try:
        price = float(data['price'])
    except (TypeError, ValueError):
        return jsonify({'message': 'Price must be a valid number'}), 400
    if not math.isfinite(price) or price < 0:
        return jsonify({'message': 'Price must be a finite non-negative number'}), 400

    ingredients = data.get('ingredients', [])
    if isinstance(ingredients, str):
        ingredients = [item.strip() for item in ingredients.splitlines() if item.strip()]
    if not isinstance(ingredients, list) or any(not isinstance(item, str) for item in ingredients):
        return jsonify({'message': 'Ingredients must be a list of text values'}), 400

    food = Food(
        name=data['name'].strip(),
        price=price,
        category=data['category'].strip(),
        area=data.get('area'),
        description=data.get('description'),
        image_url=data.get('image_url'),
        ingredients=ingredients,
        instructions=data.get('instructions'),
        source='admin'
    )
    try:
        db.session.add(food)
        db.session.commit()
        return jsonify({'message': 'Food created', 'food': food.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

@admin_bp.route('/foods/<food_key>', methods=['PUT'])
@admin_required
def update_admin_food(food_key):
    food = get_admin_food(food_key)
    data = request.get_json(silent=True) or {}
    for field in ['name', 'category', 'area', 'description', 'image_url', 'instructions']:
        if field in data:
            value = data[field]
            if not isinstance(value, str):
                return jsonify({'message': f'{field.capitalize()} must be text'}), 400
            if field in ('name', 'category'):
                if not value.strip():
                    return jsonify({'message': f'{field.capitalize()} cannot be empty'}), 400
                value = value.strip()
            setattr(food, field, value)
    if 'price' in data:
        try:
            food.price = float(data['price'])
        except (TypeError, ValueError):
            return jsonify({'message': 'Price must be a valid number'}), 400
        if not math.isfinite(food.price) or food.price < 0:
            return jsonify({'message': 'Price must be a finite non-negative number'}), 400
    if 'ingredients' in data:
        ingredients = data['ingredients']
        if isinstance(ingredients, str):
            ingredients = [item.strip() for item in ingredients.splitlines() if item.strip()]
        if not isinstance(ingredients, list) or any(not isinstance(item, str) for item in ingredients):
            return jsonify({'message': 'Ingredients must be a list of text values'}), 400
        food.ingredients = ingredients
    try:
        db.session.commit()
        return jsonify({'message': 'Food updated', 'food': food.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

@admin_bp.route('/foods/<food_key>', methods=['DELETE'])
@admin_required
def delete_admin_food(food_key):
    food = get_admin_food(food_key)
    try:
        db.session.delete(food)
        db.session.commit()
        return jsonify({'message': 'Food deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

@admin_bp.route('/foods/<food_key>/recipe', methods=['GET'])
@admin_required
def get_admin_food_recipe(food_key):
    food = get_admin_food(food_key)
    # Return full food dict (includes instructions & ingredients)
    return jsonify({'status': 'success', 'food': food.to_dict()}), 200

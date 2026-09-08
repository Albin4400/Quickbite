from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

food_bp = Blueprint('food', __name__, url_prefix='/api')

SAMPLE_FOODS = [
    {
        "id": 1,
        "name": "Artisan Truffle Burger",
        "description": "Double smash beef patty, aged cheddar, black truffle aioli, brioche bun",
        "price": 14.99,
        "category": "Burgers",
        "rating": 4.9,
        "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 2,
        "name": "Neapolitan Margherita Pizza",
        "description": "San Marzano tomatoes, fresh buffalo mozzarella, fresh basil, extra virgin olive oil",
        "price": 16.50,
        "category": "Pizza",
        "rating": 4.8,
        "imageUrl": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 3,
        "name": "Creamy Fettuccine Alfredo",
        "description": "House-made fettuccine pasta, parmesan cream reduction, garlic herb breadcrumb",
        "price": 13.99,
        "category": "Pasta",
        "rating": 4.7,
        "imageUrl": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 4,
        "name": "Crispy Korean Fried Chicken",
        "description": "Double-fried crunchy wings glazed in sweet & spicy gochujang glaze with pickled radish",
        "price": 12.99,
        "category": "Chicken",
        "rating": 4.9,
        "imageUrl": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 5,
        "name": "Avocado Citrus Bowl",
        "description": "Quinoa, sliced hass avocado, pink grapefruit, edamame, baby spinach, tahini dressing",
        "price": 11.50,
        "category": "Salads",
        "rating": 4.6,
        "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 6,
        "name": "Molten Lava Chocolate Cake",
        "description": "Warm Belgian dark chocolate cake with molten center, served with vanilla bean gelato",
        "price": 8.99,
        "category": "Desserts",
        "rating": 4.9,
        "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
    }
]

@food_bp.route('/food', methods=['GET'])
@jwt_required()
def get_foods():
    current_user_id = get_jwt_identity()
    return jsonify({
        'status': 'success',
        'userId': current_user_id,
        'count': len(SAMPLE_FOODS),
        'foods': SAMPLE_FOODS
    }), 200

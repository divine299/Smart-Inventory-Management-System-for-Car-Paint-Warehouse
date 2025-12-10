from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure the app - Railway compatible version
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-123')

# Get database URL and fix for Railway's PostgreSQL format
database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print(f"Database URL loaded: {app.config['SQLALCHEMY_DATABASE_URI']}")

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Models
class Paint(db.Model):
    __tablename__ = 'paints'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    color_code = db.Column(db.String(50))
    quantity = db.Column(db.Integer, default=0)
    unit_price = db.Column(db.Float, default=0.0)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    paint_id = db.Column(db.Integer, db.ForeignKey('paints.id'), nullable=False)
    change = db.Column(db.Integer, nullable=False)
    note = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    paint = db.relationship('Paint')

# Routes - FIXED: Return just the array, not the wrapper object
@app.route('/')
def home():
    return '<h1>Car Paint Inventory API is Running!</h1><p>Go to <a href="/api/paints">/api/paints</a> to see paints.</p>'

@app.route('/api/paints', methods=['GET'])
def get_paints():
    paints = Paint.query.all()
    # Return JUST the array of paints
    return jsonify([{
        'id': p.id, 'name': p.name, 'color_code': p.color_code,
        'quantity': p.quantity, 'unit_price': p.unit_price
    } for p in paints])

@app.route('/api/paints', methods=['POST'])
def add_paint():
    data = request.get_json()
    p = Paint(
        name=data['name'], 
        color_code=data.get('color_code', ''), 
        quantity=data.get('quantity', 0), 
        unit_price=data.get('unit_price', 0.0)
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'message': 'created', 'id': p.id}), 201

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.order_by(Transaction.timestamp.desc()).limit(100).all()
    # Return JUST the array of transactions
    return jsonify([{
        'id': t.id,
        'paint_id': t.paint_id,
        'change': t.change,
        'note': t.note,
        'timestamp': t.timestamp.isoformat()
    } for t in transactions])

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    paint_id = data['paint_id']
    change = data['change']
    note = data.get('note', '')
    p = Paint.query.get_or_404(paint_id)
    p.quantity += change
    t = Transaction(paint_id=paint_id, change=change, note=note)
    db.session.add(t)
    db.session.commit()
    return jsonify({'message': 'transaction recorded', 'new_quantity': p.quantity})

# Add this route for Railway health checks
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "car-paint-inventory-api",
        "timestamp": datetime.utcnow().isoformat()
    }), 200

# Add database initialization
@app.before_first_request
def create_tables():
    db.create_all()
    print("Database tables initialized")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
# ============================================
# FLASK API - app.py
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime
import pickle
import os

# Import the model code (assumes vark_ml_model.py exists)
from vark_ml_model import HybridVARKPredictor, engineer_features, generate_synthetic_data

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global model instance
predictor = None
MODEL_PATH = 'vark_model.pkl'

def initialize_model():
    """Load or train the model"""
    global predictor
    
    if os.path.exists(MODEL_PATH):
        print("Loading existing model...")
        with open(MODEL_PATH, 'rb') as f:
            predictor = pickle.load(f)
        print("Model loaded successfully!")
    else:
        print("Training new model...")
        # Generate training data
        df = generate_synthetic_data(n_samples=5000)
        df_featured = engineer_features(df)
        
        feature_cols = [col for col in df_featured.columns if col != 'label']
        X = df_featured[feature_cols]
        y = df_featured['label']
        
        # Train model
        predictor = HybridVARKPredictor()
        predictor.fit(X, y, epochs=100, batch_size=32, validation_split=0.2)
        
        # Save model
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(predictor, f)
        print("Model trained and saved!")

# Initialize model on startup
initialize_model()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if API is running"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': predictor is not None
    })

@app.route('/api/predict', methods=['POST'])
def predict_learning_style():
    """
    Predict learning style based on engagement and questionnaire data
    
    Expected JSON format:
    {
        "engagement": {
            "visual": {"clicks": 15, "timeSpent": 300},
            "auditory": {"clicks": 3, "timeSpent": 45},
            "reading": {"clicks": 5, "timeSpent": 80},
            "kinesthetic": {"clicks": 2, "timeSpent": 30}
        },
        "questionnaire": [0, 0, 1, 0, 2, 0, 0, 1, 0, 0]
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'engagement' not in data or 'questionnaire' not in data:
            return jsonify({
                'error': 'Missing required data. Need engagement and questionnaire fields.'
            }), 400
        
        engagement = data['engagement']
        questionnaire = data['questionnaire']
        
        # Validate questionnaire length
        if len(questionnaire) != 10:
            return jsonify({
                'error': 'Questionnaire must have exactly 10 answers'
            }), 400
        
        # Prepare data for model
        user_data = {
            'visual_clicks': engagement['visual']['clicks'],
            'visual_time': engagement['visual']['timeSpent'],
            'auditory_clicks': engagement['auditory']['clicks'],
            'auditory_time': engagement['auditory']['timeSpent'],
            'reading_clicks': engagement['reading']['clicks'],
            'reading_time': engagement['reading']['timeSpent'],
            'kinesthetic_clicks': engagement['kinesthetic']['clicks'],
            'kinesthetic_time': engagement['kinesthetic']['timeSpent']
        }
        
        # Add questionnaire answers
        for i, answer in enumerate(questionnaire):
            user_data[f'q{i+1}'] = answer
        
        # Create DataFrame and engineer features
        df = pd.DataFrame([user_data])
        df_featured = engineer_features(df)
        
        # Ensure all features are present
        X = df_featured[predictor.feature_columns]
        
        # Make prediction
        prediction = predictor.predict(X)[0]
        probabilities = predictor.predict_proba(X)[0]
        
        # Prepare response
        confidence_scores = {
            'Visual': float(probabilities[predictor.label_encoder.transform(['Visual'])[0]]),
            'Auditory': float(probabilities[predictor.label_encoder.transform(['Auditory'])[0]]),
            'Reading': float(probabilities[predictor.label_encoder.transform(['Reading'])[0]]),
            'Kinesthetic': float(probabilities[predictor.label_encoder.transform(['Kinesthetic'])[0]])
        }
        
        # Get top confidence score
        max_confidence = max(confidence_scores.values())
        
        response = {
            'success': True,
            'predicted_style': prediction,
            'confidence': max_confidence,
            'all_scores': confidence_scores,
            'timestamp': datetime.now().isoformat(),
            'description': get_style_description(prediction)
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

def get_style_description(style):
    """Get description for each learning style"""
    descriptions = {
        "Visual": "You learn best through visual aids such as diagrams, charts, videos, and spatial understanding. Visual learners often prefer to see information presented graphically and may think in pictures. To optimize your learning, use color-coding, mind maps, and visual cues when studying.",
        "Auditory": "You learn best through listening and verbal communication. Auditory learners benefit from discussions, lectures, and talking through concepts. To enhance your learning, consider reading aloud, participating in group discussions, and using voice recordings for review.",
        "Reading": "You learn best through written words and text-based input. Reading/writing learners excel when information is displayed as text and benefit from making lists, reading textbooks, and taking detailed notes. To maximize your learning, focus on text-based resources and writing summaries of information.",
        "Kinesthetic": "You learn best through physical activities and hands-on experiences. Kinesthetic learners need to touch, move, and do in order to understand concepts fully. To improve your learning, incorporate movement into study sessions, use hands-on experiments, and take frequent breaks for physical activity."
    }
    return descriptions.get(style, "")

@app.route('/api/save-engagement', methods=['POST'])
def save_engagement():
    """
    Save engagement data during user interaction (optional endpoint)
    Can be used for analytics/logging
    """
    try:
        data = request.get_json()
        # Here you could save to database
        # For now, just acknowledge receipt
        return jsonify({
            'success': True,
            'message': 'Engagement data received',
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("VARK Learning Style Predictor API")
    print("="*60)
    print("API running on http://localhost:5000")
    print("Endpoints:")
    print("  GET  /api/health  - Health check")
    print("  POST /api/predict - Predict learning style")
    print("  POST /api/save-engagement - Save engagement data")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)



from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime
import pickle
import os

# Import the enhanced model
from vark_ml_model import HybridVARKPredictor, engineer_features, generate_synthetic_data

app = Flask(__name__)
CORS(app)

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
        df = generate_synthetic_data(n_samples=5000)
        df_featured = engineer_features(df)
        
        feature_cols = [col for col in df_featured.columns if col != 'label']
        X = df_featured[feature_cols]
        y = df_featured['label']
        
        predictor = HybridVARKPredictor()
        predictor.fit(X, y, epochs=100, batch_size=32, validation_split=0.2)
        
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(predictor, f)
        print("Model trained and saved!")

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
    Predict learning style based on comprehensive engagement data
    
    Expected JSON format:
    {
        "engagement": {
            "visual": {
                "clicks": 15,
                "timeSpent": 300,
                "videoPlays": 5,
                "videoPauses": 2,
                "videoCompletionPercent": 85,
                "hoverTime": 45,
                "revisits": 1
            },
            "auditory": {
                "clicks": 3,
                "timeSpent": 45,
                "audioPlays": 1,
                "audioPauses": 0,
                "audioCompletionPercent": 30,
                "seekEvents": 0,
                "hoverTime": 10,
                "revisits": 0
            },
            "reading": {
                "clicks": 5,
                "timeSpent": 80,
                "scrollDepth": 45,
                "maxScrollDepth": 60,
                "textSelections": 2,
                "hoverTime": 15,
                "revisits": 0
            },
            "kinesthetic": {
                "clicks": 2,
                "timeSpent": 30,
                "dragAttempts": 4,
                "incorrectDrops": 1,
                "correctDrops": 3,
                "taskCompletionTime": 45,
                "firstAttemptSuccess": true,
                "resetClicks": 0,
                "hoverTime": 20,
                "revisits": 0
            }
        },
        "questionnaire": [0, 0, 1, 0, 2, 0, 0, 1, 0, 0],
        "metadata": {
            "firstInteraction": "visual",
            "interactionSequence": [...],
            "totalSessionTime": 500
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'engagement' not in data or 'questionnaire' not in data:
            return jsonify({
                'error': 'Missing required data. Need engagement and questionnaire fields.'
            }), 400
        
        engagement = data['engagement']
        questionnaire = data['questionnaire']
        
        if len(questionnaire) != 10:
            return jsonify({
                'error': 'Questionnaire must have exactly 10 answers'
            }), 400
        
        # Extract all metrics from engagement data
        visual = engagement['visual']
        auditory = engagement['auditory']
        reading = engagement['reading']
        kinesthetic = engagement['kinesthetic']
        
        # Prepare complete data for model
        user_data = {
            # Visual metrics
            'visual_clicks': visual['clicks'],
            'visual_time': visual['timeSpent'],
            'video_plays': visual.get('videoPlays', 0),
            'video_pauses': visual.get('videoPauses', 0),
            'video_completion': visual.get('videoCompletionPercent', 0),
            'visual_hover': visual.get('hoverTime', 0),
            'visual_revisits': visual.get('revisits', 0),
            
            # Auditory metrics
            'auditory_clicks': auditory['clicks'],
            'auditory_time': auditory['timeSpent'],
            'audio_plays': auditory.get('audioPlays', 0),
            'audio_pauses': auditory.get('audioPauses', 0),
            'audio_completion': auditory.get('audioCompletionPercent', 0),
            'audio_seeks': auditory.get('seekEvents', 0),
            'auditory_hover': auditory.get('hoverTime', 0),
            'auditory_revisits': auditory.get('revisits', 0),
            
            # Reading metrics
            'reading_clicks': reading['clicks'],
            'reading_time': reading['timeSpent'],
            'scroll_depth': reading.get('scrollDepth', 0),
            'max_scroll': reading.get('maxScrollDepth', 0),
            'text_selections': reading.get('textSelections', 0),
            'reading_hover': reading.get('hoverTime', 0),
            'reading_revisits': reading.get('revisits', 0),
            
            # Kinesthetic metrics
            'kinesthetic_clicks': kinesthetic['clicks'],
            'kinesthetic_time': kinesthetic['timeSpent'],
            'drag_attempts': kinesthetic.get('dragAttempts', 0),
            'incorrect_drops': kinesthetic.get('incorrectDrops', 0),
            'correct_drops': kinesthetic.get('correctDrops', 0),
            'completion_time': kinesthetic.get('taskCompletionTime', 0),
            'first_success': 1 if kinesthetic.get('firstAttemptSuccess', False) else 0,
            'reset_clicks': kinesthetic.get('resetClicks', 0),
            'kinesthetic_hover': kinesthetic.get('hoverTime', 0),
            'kinesthetic_revisits': kinesthetic.get('revisits', 0)
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
        
        # Prepare confidence scores
        confidence_scores = {
            'Visual': float(probabilities[predictor.label_encoder.transform(['Visual'])[0]]),
            'Auditory': float(probabilities[predictor.label_encoder.transform(['Auditory'])[0]]),
            'Reading': float(probabilities[predictor.label_encoder.transform(['Reading'])[0]]),
            'Kinesthetic': float(probabilities[predictor.label_encoder.transform(['Kinesthetic'])[0]])
        }
        
        max_confidence = max(confidence_scores.values())
        
        # Generate insights based on engagement patterns
        insights = generate_insights(engagement, questionnaire, prediction)
        
        response = {
            'success': True,
            'predicted_style': prediction,
            'confidence': max_confidence,
            'all_scores': confidence_scores,
            'timestamp': datetime.now().isoformat(),
            'description': get_style_description(prediction),
            'insights': insights,
            'recommendations': get_recommendations(prediction, engagement)
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

def generate_insights(engagement, questionnaire, predicted_style):
    """Generate personalized insights based on engagement patterns"""
    insights = []
    
    # Analyze engagement time distribution
    total_time = (engagement['visual']['timeSpent'] + 
                  engagement['auditory']['timeSpent'] + 
                  engagement['reading']['timeSpent'] + 
                  engagement['kinesthetic']['timeSpent'])
    
    if total_time > 0:
        visual_pct = (engagement['visual']['timeSpent'] / total_time) * 100
        auditory_pct = (engagement['auditory']['timeSpent'] / total_time) * 100
        reading_pct = (engagement['reading']['timeSpent'] / total_time) * 100
        kinesthetic_pct = (engagement['kinesthetic']['timeSpent'] / total_time) * 100
        
        max_time_style = max([
            ('Visual', visual_pct),
            ('Auditory', auditory_pct),
            ('Reading', reading_pct),
            ('Kinesthetic', kinesthetic_pct)
        ], key=lambda x: x[1])
        
        insights.append(f"You spent {max_time_style[1]:.1f}% of your time on {max_time_style[0]} content")
    
    # Video engagement
    if engagement['visual']['videoPlays'] > 3:
        insights.append(f"You played the video {engagement['visual']['videoPlays']} times, showing strong visual learning interest")
    
    if engagement['visual']['videoCompletionPercent'] > 80:
        insights.append("You watched most of the video content, indicating high visual engagement")
    
    # Audio engagement
    if engagement['auditory']['seekEvents'] > 2:
        insights.append("You frequently rewound the audio, suggesting you process information thoroughly through listening")
    
    if engagement['auditory']['audioCompletionPercent'] > 80:
        insights.append("You listened to most of the audio content, showing strong auditory preferences")
    
    # Reading engagement
    if engagement['reading']['maxScrollDepth'] > 80:
        insights.append("You thoroughly read the text content, scrolling through most of it")
    
    if engagement['reading']['textSelections'] > 3:
        insights.append(f"You highlighted text {engagement['reading']['textSelections']} times, showing active reading habits")
    
    # Kinesthetic engagement
    if engagement['kinesthetic']['dragAttempts'] > 5:
        insights.append("You actively engaged with the interactive activity, showing hands-on learning preference")
    
    if engagement['kinesthetic'].get('firstAttemptSuccess'):
        insights.append("You solved the interactive puzzle on your first try, demonstrating strong kinesthetic intuition")
    
    # Questionnaire consistency
    q_counts = [questionnaire.count(i) for i in range(4)]
    max_q = max(q_counts)
    if max_q >= 7:
        insights.append(f"Your questionnaire responses were highly consistent ({max_q}/10), reinforcing your {predicted_style} preference")
    
    return insights

def get_recommendations(style, engagement):
    """Generate personalized learning recommendations"""
    recommendations = {
        'Visual': [
            "Use mind maps and diagrams to organize information",
            "Watch educational videos and documentaries",
            "Color-code your notes and use highlighters",
            "Create flowcharts and infographics for complex topics",
            "Use visual aids like charts, graphs, and images when studying"
        ],
        'Auditory': [
            "Record lectures and listen to them while commuting",
            "Join study groups and discuss concepts out loud",
            "Use audiobooks and podcasts for learning",
            "Explain concepts to others or teach what you've learned",
            "Create mnemonic devices and verbal associations"
        ],
        'Reading': [
            "Take detailed written notes during lessons",
            "Read textbooks and articles thoroughly",
            "Create written summaries and outlines",
            "Make lists and write down key points",
            "Use flashcards with written definitions"
        ],
        'Kinesthetic': [
            "Take breaks to move around while studying",
            "Use hands-on experiments and simulations",
            "Create physical models or use manipulatives",
            "Act out scenarios or use role-playing",
            "Study while walking or doing light physical activity"
        ]
    }
    
    return recommendations.get(style, [])

def get_style_description(style):
    """Get detailed description for each learning style"""
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
    Save engagement data for analytics (optional)
    """
    try:
        data = request.get_json()
        # In production, you would save this to a database
        # For now, just log it
        print(f"Engagement data received at {datetime.now()}")
        print(f"Session data: {data.get('metadata', {})}")
        
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

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """
    Get aggregated analytics (placeholder for future implementation)
    """
    return jsonify({
        'message': 'Analytics endpoint - implement database queries here',
        'timestamp': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    print("\n" + "="*60)
    print("VARK LEARNING STYLE PREDICTOR API")
    print("="*60)
    print("API running on http://localhost:5000")
    print("\nEndpoints:")
    print("  GET  /api/health           - Health check")
    print("  POST /api/predict          - Predict learning style")
    print("  POST /api/save-engagement  - Save engagement data")
    print("  GET  /api/analytics        - Get analytics")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
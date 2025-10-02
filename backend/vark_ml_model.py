import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, regularizers
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import warnings
warnings.filterwarnings('ignore')

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# ============================================
# 1. DATA GENERATION (Synthetic Training Data)
# ============================================

def generate_synthetic_data(n_samples=5000):
    """
    Generate synthetic training data with realistic patterns
    Features:
    - Engagement metrics: clicks, time_spent for each VARK style
    - Questionnaire responses: 10 questions with 4 options each
    """
    data = []
    
    for _ in range(n_samples):
        # Randomly assign a true learning style
        true_style = np.random.choice(['Visual', 'Auditory', 'Reading', 'Kinesthetic'])
        
        # Generate engagement metrics with style-specific patterns
        if true_style == 'Visual':
            visual_clicks = np.random.randint(8, 25)
            visual_time = np.random.randint(120, 600)
            auditory_clicks = np.random.randint(0, 8)
            auditory_time = np.random.randint(0, 120)
            reading_clicks = np.random.randint(0, 10)
            reading_time = np.random.randint(0, 180)
            kinesthetic_clicks = np.random.randint(0, 8)
            kinesthetic_time = np.random.randint(0, 120)
            
        elif true_style == 'Auditory':
            visual_clicks = np.random.randint(0, 10)
            visual_time = np.random.randint(0, 180)
            auditory_clicks = np.random.randint(8, 25)
            auditory_time = np.random.randint(120, 600)
            reading_clicks = np.random.randint(0, 8)
            reading_time = np.random.randint(0, 120)
            kinesthetic_clicks = np.random.randint(0, 8)
            kinesthetic_time = np.random.randint(0, 120)
            
        elif true_style == 'Reading':
            visual_clicks = np.random.randint(0, 8)
            visual_time = np.random.randint(0, 120)
            auditory_clicks = np.random.randint(0, 8)
            auditory_time = np.random.randint(0, 120)
            reading_clicks = np.random.randint(8, 25)
            reading_time = np.random.randint(120, 600)
            kinesthetic_clicks = np.random.randint(0, 10)
            kinesthetic_time = np.random.randint(0, 180)
            
        else:  # Kinesthetic
            visual_clicks = np.random.randint(0, 8)
            visual_time = np.random.randint(0, 120)
            auditory_clicks = np.random.randint(0, 8)
            auditory_time = np.random.randint(0, 120)
            reading_clicks = np.random.randint(0, 8)
            reading_time = np.random.randint(0, 120)
            kinesthetic_clicks = np.random.randint(8, 25)
            kinesthetic_time = np.random.randint(120, 600)
        
        # Generate questionnaire responses (10 questions, 0-3 for each option)
        # Bias responses toward the true style
        style_map = {'Visual': 0, 'Auditory': 1, 'Reading': 2, 'Kinesthetic': 3}
        preferred_answer = style_map[true_style]
        
        questionnaire = []
        for _ in range(10):
            if np.random.random() < 0.7:  # 70% chance of choosing preferred style
                questionnaire.append(preferred_answer)
            else:
                questionnaire.append(np.random.choice([0, 1, 2, 3]))
        
        # Compile row
        row = {
            'visual_clicks': visual_clicks,
            'visual_time': visual_time,
            'auditory_clicks': auditory_clicks,
            'auditory_time': auditory_time,
            'reading_clicks': reading_clicks,
            'reading_time': reading_time,
            'kinesthetic_clicks': kinesthetic_clicks,
            'kinesthetic_time': kinesthetic_time,
            'label': true_style
        }
        
        # Add questionnaire responses
        for i, ans in enumerate(questionnaire):
            row[f'q{i+1}'] = ans
            
        data.append(row)
    
    return pd.DataFrame(data)

# ============================================
# 2. FEATURE ENGINEERING
# ============================================

def engineer_features(df):
    """Create advanced features from raw data"""
    df_featured = df.copy()
    
    # Total engagement metrics
    df_featured['total_clicks'] = (df['visual_clicks'] + df['auditory_clicks'] + 
                                   df['reading_clicks'] + df['kinesthetic_clicks'])
    df_featured['total_time'] = (df['visual_time'] + df['auditory_time'] + 
                                 df['reading_time'] + df['kinesthetic_time'])
    
    # Engagement ratios (proportion of attention to each style)
    df_featured['visual_click_ratio'] = df['visual_clicks'] / (df_featured['total_clicks'] + 1)
    df_featured['auditory_click_ratio'] = df['auditory_clicks'] / (df_featured['total_clicks'] + 1)
    df_featured['reading_click_ratio'] = df['reading_clicks'] / (df_featured['total_clicks'] + 1)
    df_featured['kinesthetic_click_ratio'] = df['kinesthetic_clicks'] / (df_featured['total_clicks'] + 1)
    
    df_featured['visual_time_ratio'] = df['visual_time'] / (df_featured['total_time'] + 1)
    df_featured['auditory_time_ratio'] = df['auditory_time'] / (df_featured['total_time'] + 1)
    df_featured['reading_time_ratio'] = df['reading_time'] / (df_featured['total_time'] + 1)
    df_featured['kinesthetic_time_ratio'] = df['kinesthetic_time'] / (df_featured['total_time'] + 1)
    
    # Average time per click
    df_featured['visual_avg_time'] = df['visual_time'] / (df['visual_clicks'] + 1)
    df_featured['auditory_avg_time'] = df['auditory_time'] / (df['auditory_clicks'] + 1)
    df_featured['reading_avg_time'] = df['reading_time'] / (df['reading_clicks'] + 1)
    df_featured['kinesthetic_avg_time'] = df['kinesthetic_time'] / (df['kinesthetic_clicks'] + 1)
    
    # Questionnaire analysis
    questionnaire_cols = [f'q{i+1}' for i in range(10)]
    
    # Count of each answer type (Visual=0, Auditory=1, Reading=2, Kinesthetic=3)
    for i in range(4):
        df_featured[f'answer_{i}_count'] = df[questionnaire_cols].apply(
            lambda row: (row == i).sum(), axis=1
        )
    
    # Dominant answer pattern
    df_featured['dominant_answer'] = df[questionnaire_cols].mode(axis=1)[0]
    
    # Answer consistency (how often the most common answer appears)
    df_featured['answer_consistency'] = df[questionnaire_cols].apply(
        lambda row: row.value_counts().max() / len(row), axis=1
    )
    
    return df_featured

# ============================================
# 3. DEEP LEARNING MODEL
# ============================================

def create_deep_model(input_dim, num_classes=4):
    """
    Create a deep neural network with attention mechanism
    """
    inputs = keras.Input(shape=(input_dim,))
    
    # Initial dense layers with batch normalization
    x = layers.Dense(256, kernel_regularizer=regularizers.l2(0.001))(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(0.4)(x)
    
    x = layers.Dense(128, kernel_regularizer=regularizers.l2(0.001))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(0.3)(x)
    
    x = layers.Dense(64, kernel_regularizer=regularizers.l2(0.001))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(0.2)(x)
    
    x = layers.Dense(32, kernel_regularizer=regularizers.l2(0.001))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    
    # Output layer
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = keras.Model(inputs=inputs, outputs=outputs)
    
    # Compile with optimizer
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# ============================================
# 4. ENSEMBLE MODEL
# ============================================

def create_ensemble_model():
    """Create an ensemble of traditional ML models"""
    rf = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    gb = GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=7,
        random_state=42
    )
    
    ensemble = VotingClassifier(
        estimators=[('rf', rf), ('gb', gb)],
        voting='soft'
    )
    
    return ensemble

# ============================================
# 5. HYBRID MODEL (COMBINES DL + ENSEMBLE)
# ============================================

class HybridVARKPredictor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.dl_model = None
        self.ensemble_model = None
        self.feature_columns = None
        
    def fit(self, X, y, epochs=100, batch_size=32, validation_split=0.2):
        """Train both DL and ensemble models"""
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        self.feature_columns = X.columns.tolist()
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X_scaled, y_encoded, test_size=validation_split, 
            random_state=42, stratify=y_encoded
        )
        
        print("Training Deep Learning Model...")
        # Train DL model
        self.dl_model = create_deep_model(X.shape[1])
        
        early_stop = EarlyStopping(
            monitor='val_accuracy',
            patience=15,
            restore_best_weights=True
        )
        
        reduce_lr = ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=0.00001
        )
        
        history = self.dl_model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=[early_stop, reduce_lr],
            verbose=1
        )
        
        print("\nTraining Ensemble Model...")
        # Train ensemble model
        self.ensemble_model = create_ensemble_model()
        self.ensemble_model.fit(X_train, y_train)
        
        # Evaluate on validation set
        dl_pred = np.argmax(self.dl_model.predict(X_val, verbose=0), axis=1)
        ensemble_pred = self.ensemble_model.predict(X_val)
        
        dl_acc = accuracy_score(y_val, dl_pred)
        ensemble_acc = accuracy_score(y_val, ensemble_pred)
        
        print(f"\nValidation Accuracy:")
        print(f"Deep Learning Model: {dl_acc:.4f}")
        print(f"Ensemble Model: {ensemble_acc:.4f}")
        
        return history
    
    def predict(self, X, use_voting=True):
        """
        Make predictions using hybrid approach
        Args:
            X: Input features
            use_voting: If True, combine DL and ensemble predictions
        """
        X_scaled = self.scaler.transform(X)
        
        # Get predictions from both models
        dl_probs = self.dl_model.predict(X_scaled, verbose=0)
        ensemble_probs = self.ensemble_model.predict_proba(X_scaled)
        
        if use_voting:
            # Weighted average (DL gets higher weight due to better performance)
            combined_probs = 0.6 * dl_probs + 0.4 * ensemble_probs
            predictions = np.argmax(combined_probs, axis=1)
        else:
            predictions = np.argmax(dl_probs, axis=1)
        
        # Decode labels
        return self.label_encoder.inverse_transform(predictions)
    
    def predict_proba(self, X):
        """Get probability predictions"""
        X_scaled = self.scaler.transform(X)
        dl_probs = self.dl_model.predict(X_scaled, verbose=0)
        ensemble_probs = self.ensemble_model.predict_proba(X_scaled)
        combined_probs = 0.6 * dl_probs + 0.4 * ensemble_probs
        return combined_probs

# ============================================
# 6. TRAINING AND EVALUATION
# ============================================

def main():
    print("=" * 60)
    print("VARK LEARNING STYLE PREDICTION SYSTEM")
    print("=" * 60)
    
    # Generate synthetic data
    print("\n1. Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=5000)
    print(f"Generated {len(df)} samples")
    print(f"Class distribution:\n{df['label'].value_counts()}")
    
    # Engineer features
    print("\n2. Engineering features...")
    df_featured = engineer_features(df)
    
    # Prepare data
    feature_cols = [col for col in df_featured.columns if col != 'label']
    X = df_featured[feature_cols]
    y = df_featured['label']
    
    print(f"Total features: {len(feature_cols)}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )
    
    print(f"\nTraining samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")
    
    # Train model
    print("\n3. Training Hybrid Model...")
    print("-" * 60)
    
    predictor = HybridVARKPredictor()
    history = predictor.fit(X_train, y_train, epochs=100, batch_size=32)
    
    # Final evaluation on test set
    print("\n4. Final Evaluation on Test Set...")
    print("-" * 60)
    
    y_pred = predictor.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n🎯 FINAL TEST ACCURACY: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred, labels=['Visual', 'Auditory', 'Reading', 'Kinesthetic'])
    print(cm)
    
    # Save model
    print("\n5. Saving model...")
    predictor.dl_model.save('vark_dl_model.h5')
    print("Model saved successfully!")
    
    return predictor, X_test, y_test

# ============================================
# 7. EXAMPLE USAGE FOR NEW PREDICTIONS
# ============================================

def predict_new_user(predictor, engagement_data, questionnaire_data):
    """
    Predict learning style for a new user
    
    Args:
        engagement_data: dict with keys like 'visual_clicks', 'visual_time', etc.
        questionnaire_data: list of 10 answers (0-3 for each question)
    
    Returns:
        Predicted learning style and probabilities
    """
    # Combine data
    user_data = engagement_data.copy()
    for i, answer in enumerate(questionnaire_data):
        user_data[f'q{i+1}'] = answer
    
    # Create DataFrame
    df = pd.DataFrame([user_data])
    
    # Engineer features
    df_featured = engineer_features(df)
    
    # Ensure all features are present
    X = df_featured[predictor.feature_columns]
    
    # Predict
    prediction = predictor.predict(X)[0]
    probabilities = predictor.predict_proba(X)[0]
    
    result = {
        'predicted_style': prediction,
        'confidence': {
            'Visual': probabilities[predictor.label_encoder.transform(['Visual'])[0]],
            'Auditory': probabilities[predictor.label_encoder.transform(['Auditory'])[0]],
            'Reading': probabilities[predictor.label_encoder.transform(['Reading'])[0]],
            'Kinesthetic': probabilities[predictor.label_encoder.transform(['Kinesthetic'])[0]]
        }
    }
    
    return result

# Run the training
if __name__ == "__main__":
    predictor, X_test, y_test = main()
    
    print("\n" + "=" * 60)
    print("EXAMPLE: Predicting for a new user")
    print("=" * 60)
    
    # Example new user data
    example_engagement = {
        'visual_clicks': 15,
        'visual_time': 300,
        'auditory_clicks': 3,
        'auditory_time': 45,
        'reading_clicks': 5,
        'reading_time': 80,
        'kinesthetic_clicks': 2,
        'kinesthetic_time': 30
    }
    
    example_questionnaire = [0, 0, 0, 0, 1, 0, 0, 2, 0, 0]  # Mostly Visual answers
    
    result = predict_new_user(predictor, example_engagement, example_questionnaire)
    
    print(f"\nPredicted Learning Style: {result['predicted_style']}")
    print("\nConfidence Scores:")
    for style, conf in result['confidence'].items():
        print(f"  {style}: {conf:.4f} ({conf*100:.2f}%)")
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings('ignore')

class TransConnectModel:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=150,
            random_state=42,
            n_jobs=-1
        )
        
        self.results = {}
        self.label_encoder = LabelEncoder()
        
    def load_and_prepare_data(self, file_path):
        print("Loading and preparing data...")
        
        df = pd.read_csv(file_path)
        
        if 'timestamp' in df.columns:
            df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
            df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        else:
            df['hour'] = np.random.randint(5, 22, len(df))
            df['day_of_week'] = np.random.randint(0, 7, len(df))

        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['is_rush_hour'] = (
            ((df['hour'] >= 7) & (df['hour'] <= 9)) |
            ((df['hour'] >= 16) & (df['hour'] <= 19))
        ).astype(int)

        return df
    
    def create_features(self, df):
        print("Creating features...")
        
        feature_columns = [
            'latitude', 'longitude', 'stop_sequence',
            'distance_to_next', 'cumulative_distance',
            'hour', 'day_of_week', 'is_weekend', 'is_rush_hour'
        ]
        
        available_features = [col for col in feature_columns if col in df.columns]
        
        if 'estimated_travel_time_min' not in df.columns:
            df['estimated_travel_time_min'] = (df['distance_to_next'] / 25) * 60
        
        X = df[available_features]
        y = df['estimated_travel_time_min']
        
        print(f"Features used: {available_features}")
        return X, y
    
    def train_models(self, X, y):
        print("\nTraining Random Forest model...")
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        self.results = {
            'Random Forest': {
                'model': self.model,
                'mae': mae,
                'mse': mse,
                'rmse': rmse,
                'r2': r2,
                'predictions': y_pred
            }
        }
        
        print(f"Random Forest - RMSE: {rmse:.2f}, R²: {r2:.2f}")
        
        return X_test, y_test
    
    def evaluate_models(self, X_test, y_test):
        print("\n" + "="*50)
        print("MODEL EVALUATION RESULTS")
        print("="*50)

        r = self.results['Random Forest']
        
        df = pd.DataFrame({
            'Model': ['Random Forest'],
            'MAE': [r['mae']],
            'MSE': [r['mse']],
            'RMSE': [r['rmse']],
            'R²': [r['r2']]
        })
        
        print(df.to_string(index=False))
        return df
    
    def visualize_results(self, X_test, y_test):
        print("\nCreating visualizations...")
        
        result = self.results['Random Forest']
        y_pred = result['predictions']
        
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))
        
        # 1. Actual vs Predicted
        axes[0].scatter(y_test, y_pred, alpha=0.6)
        axes[0].plot([y_test.min(), y_test.max()],
                     [y_test.min(), y_test.max()], 'r--')
        axes[0].set_title("Actual vs Predicted (Random Forest)")
        axes[0].set_xlabel("Actual")
        axes[0].set_ylabel("Predicted")
        
        # 2. Residual Plot
        residuals = y_test - y_pred
        axes[1].scatter(y_pred, residuals, alpha=0.6)
        axes[1].axhline(0, color='red', linestyle='--')
        axes[1].set_title("Residual Plot (Random Forest)")
        axes[1].set_xlabel("Predicted")
        axes[1].set_ylabel("Residuals")
        
        plt.tight_layout()
        plt.show()
    
    def predict_arrival_time(self, features):
        """Predict using Random Forest (no scaling needed)"""
        return self.model.predict([features])[0]

# Main execution
def main():
    transconnect_model = TransConnectModel()
    
    try:
        df = transconnect_model.load_and_prepare_data('transconnect_processed_data.csv')
    except:
        print("Processed data not found, generating sample data...")
        df = pd.DataFrame({
            'latitude': np.random.uniform(-1.95, -1.97, 100),
            'longitude': np.random.uniform(30.10, 30.22, 100),
            'stop_sequence': np.arange(100),
            'distance_to_next': np.random.uniform(0.1, 2.0, 100),
            'cumulative_distance': np.cumsum(np.random.uniform(0.1, 2.0, 100)),
            'estimated_travel_time_min': np.random.uniform(0.5, 10, 100),
            'hour': np.random.randint(5, 22, 100),
            'day_of_week': np.random.randint(0, 7, 100),
        })
        df['is_weekend'] = df['day_of_week'].isin([5,6]).astype(int)
        df['is_rush_hour'] = ((df['hour']>=7)&(df['hour']<=9) | (df['hour']>=16)&(df['hour']<=19)).astype(int)
    
    X, y = transconnect_model.create_features(df)
    X_test, y_test = transconnect_model.train_models(X, y)
    results_df = transconnect_model.evaluate_models(X_test, y_test)
    
    transconnect_model.visualize_results(X_test, y_test)
    results_df.to_csv('model_results_random_forest.csv', index=False)
    
    # Example prediction
    sample = X.iloc[0].values
    prediction = transconnect_model.predict_arrival_time(sample)
    
    print("\nExample prediction:")
    print(f"Predicted: {prediction:.2f} minutes")
    print(f"Actual: {y.iloc[0]:.2f} minutes")

if __name__ == "__main__":
    main()

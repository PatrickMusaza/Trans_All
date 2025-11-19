import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
import warnings
warnings.filterwarnings('ignore')

class TransConnectModel:
    def __init__(self):
        self.models = {
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'Linear Regression': LinearRegression(),
            'Decision Tree': DecisionTreeRegressor(random_state=42)
        }
        self.results = {}
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        
    def load_and_prepare_data(self, file_path):
        """Load and prepare the bus route data for modeling"""
        print("Loading and preparing data...")
        
        # Load the data
        df = pd.read_csv(file_path)
        
        # Basic feature engineering
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour if 'timestamp' in df.columns else 12
        df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek if 'timestamp' in df.columns else 1
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['is_rush_hour'] = ((df['hour'] >= 7) & (df['hour'] <= 9) | 
                             (df['hour'] >= 16) & (df['hour'] <= 19)).astype(int)
        
        # If no timestamp, create synthetic features
        if 'timestamp' not in df.columns:
            df['hour'] = np.random.randint(5, 22, len(df))
            df['day_of_week'] = np.random.randint(0, 7, len(df))
            df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
            df['is_rush_hour'] = ((df['hour'] >= 7) & (df['hour'] <= 9) | 
                                 (df['hour'] >= 16) & (df['hour'] <= 19)).astype(int)
        
        return df
    
    def create_features(self, df):
        """Create features for the model"""
        print("Creating features...")
        
        # Select features for modeling
        feature_columns = [
            'latitude', 'longitude', 'stop_sequence', 
            'distance_to_next', 'cumulative_distance',
            'hour', 'day_of_week', 'is_weekend', 'is_rush_hour'
        ]
        
        # Use available columns
        available_features = [col for col in feature_columns if col in df.columns]
        
        # If we don't have travel time, create a target based on distance
        if 'estimated_travel_time_min' not in df.columns and 'distance_to_next' in df.columns:
            # Assume average speed of 25 km/h for urban traffic
            df['estimated_travel_time_min'] = (df['distance_to_next'] / 25) * 60
        
        X = df[available_features]
        y = df['estimated_travel_time_min'] if 'estimated_travel_time_min' in df.columns else df['distance_to_next']
        
        print(f"Features used: {available_features}")
        print(f"Target variable: {'estimated_travel_time_min' if 'estimated_travel_time_min' in df.columns else 'distance_to_next'}")
        
        return X, y
    
    def train_models(self, X, y):
        """Train multiple models and evaluate their performance"""
        print("\nTraining models...")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        model_results = {}
        
        for name, model in self.models.items():
            print(f"Training {name}...")
            
            # Train model
            if name == 'Linear Regression':
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
            
            # Calculate metrics
            mae = mean_absolute_error(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_test, y_pred)
            
            # Store results
            model_results[name] = {
                'model': model,
                'mae': mae,
                'mse': mse,
                'rmse': rmse,
                'r2': r2,
                'predictions': y_pred
            }
            
            print(f"  {name} - RMSE: {rmse:.2f}, R²: {r2:.2f}")
        
        self.results = model_results
        return X_test, y_test
    
    def evaluate_models(self, X_test, y_test):
        """Comprehensive model evaluation"""
        print("\n" + "="*50)
        print("MODEL EVALUATION RESULTS")
        print("="*50)
        
        # Create comparison table
        comparison_df = pd.DataFrame({
            'Model': [],
            'MAE': [],
            'MSE': [],
            'RMSE': [],
            'R²': []
        })
        
        for name, result in self.results.items():
            comparison_df = pd.concat([comparison_df, pd.DataFrame({
                'Model': [name],
                'MAE': [result['mae']],
                'MSE': [result['mse']],
                'RMSE': [result['rmse']],
                'R²': [result['r2']]
            })], ignore_index=True)
        
        # Sort by RMSE (lower is better)
        comparison_df = comparison_df.sort_values('RMSE')
        
        print("\nModel Performance Comparison (sorted by RMSE):")
        print(comparison_df.to_string(index=False))
        
        return comparison_df
    
    def visualize_results(self, X_test, y_test):
        """Create visualizations of model performance"""
        print("\nCreating visualizations...")
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Model comparison bar chart
        models = list(self.results.keys())
        rmse_scores = [self.results[model]['rmse'] for model in models]
        r2_scores = [self.results[model]['r2'] for model in models]
        
        axes[0,0].bar(models, rmse_scores, color=['skyblue', 'lightgreen', 'orange', 'pink'])
        axes[0,0].set_title('Model Comparison - RMSE\n(Lower is Better)')
        axes[0,0].set_ylabel('RMSE')
        axes[0,0].tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for i, v in enumerate(rmse_scores):
            axes[0,0].text(i, v + 0.01, f'{v:.2f}', ha='center', va='bottom')
        
        # 2. R² comparison
        axes[0,1].bar(models, r2_scores, color=['skyblue', 'lightgreen', 'orange', 'pink'])
        axes[0,1].set_title('Model Comparison - R² Score\n(Higher is Better)')
        axes[0,1].set_ylabel('R² Score')
        axes[0,1].tick_params(axis='x', rotation=45)
        
        # Add value labels on bars
        for i, v in enumerate(r2_scores):
            axes[0,1].text(i, v + 0.01, f'{v:.2f}', ha='center', va='bottom')
        
        # 3. Actual vs Predicted for best model
        best_model_name = min(self.results.keys(), key=lambda x: self.results[x]['rmse'])
        best_predictions = self.results[best_model_name]['predictions']
        
        axes[1,0].scatter(y_test, best_predictions, alpha=0.6)
        axes[1,0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
        axes[1,0].set_xlabel('Actual Values')
        axes[1,0].set_ylabel('Predicted Values')
        axes[1,0].set_title(f'Actual vs Predicted - {best_model_name}\n(Perfect prediction = red line)')
        
        # 4. Residual plot for best model
        residuals = y_test - best_predictions
        axes[1,1].scatter(best_predictions, residuals, alpha=0.6)
        axes[1,1].axhline(y=0, color='r', linestyle='--')
        axes[1,1].set_xlabel('Predicted Values')
        axes[1,1].set_ylabel('Residuals')
        axes[1,1].set_title(f'Residual Plot - {best_model_name}\n(Random pattern = good model)')
        
        plt.tight_layout()
        plt.savefig('model_performance_comparison.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def predict_arrival_time(self, model_name, features):
        """Predict arrival time using the trained model"""
        if model_name in self.results:
            model = self.results[model_name]['model']
            
            if model_name == 'Linear Regression':
                features_scaled = self.scaler.transform([features])
                prediction = model.predict(features_scaled)[0]
            else:
                prediction = model.predict([features])[0]
            
            return prediction
        else:
            print(f"Model {model_name} not found!")
            return None

# Main execution
def main():
    # Initialize the model
    transconnect_model = TransConnectModel()
    
    # Load your data (replace with your actual file path)
    try:
        df = transconnect_model.load_and_prepare_data('transconnect_processed_data.csv')
    except:
        print("Processed data not found, using sample data...")
        # Create sample data for demonstration
        df = pd.DataFrame({
            'latitude': np.random.uniform(-1.95, -1.97, 100),
            'longitude': np.random.uniform(30.10, 30.22, 100),
            'stop_sequence': np.arange(100),
            'distance_to_next': np.random.uniform(0.1, 2.0, 100),
            'cumulative_distance': np.cumsum(np.random.uniform(0.1, 2.0, 100)),
            'estimated_travel_time_min': np.random.uniform(0.5, 10, 100)
        })
    
    # Create features and target
    X, y = transconnect_model.create_features(df)
    
    # Train models
    X_test, y_test = transconnect_model.train_models(X, y)
    
    # Evaluate models
    results_df = transconnect_model.evaluate_models(X_test, y_test)
    
    # Visualize results
    transconnect_model.visualize_results(X_test, y_test)
    
    # Save results
    results_df.to_csv('model_comparison_results.csv', index=False)
    print(f"\nResults saved to 'model_comparison_results.csv'")
    
    # Example prediction
    if len(X) > 0:
        sample_features = X.iloc[0].values
        best_model = results_df.iloc[0]['Model']
        prediction = transconnect_model.predict_arrival_time(best_model, sample_features)
        print(f"\nExample prediction using {best_model}:")
        print(f"Predicted travel time: {prediction:.2f} minutes")
        print(f"Actual travel time: {y.iloc[0]:.2f} minutes")

if __name__ == "__main__":
    main()
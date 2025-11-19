import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt

print("=== SIMPLE TRANSCONNECT MODEL ===")

# Load or create sample data
try:
    df = pd.read_csv('transconnect_processed_data.csv')
    print("Loaded processed data")
except:
    print("Creating sample data...")
    # Sample bus route data
    np.random.seed(42)
    n_samples = 200
    
    df = pd.DataFrame({
        'stop_sequence': range(n_samples),
        'distance_km': np.random.uniform(0.1, 3.0, n_samples),
        'hour': np.random.randint(5, 22, n_samples),
        'is_rush_hour': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'is_weekend': np.random.choice([0, 1], n_samples, p=[0.8, 0.2])
    })
    
    # Create target variable (travel time in minutes)
    # Base time + rush hour effect + weekend effect + random noise
    df['travel_time_min'] = (df['distance_km'] / 0.4) + \
                           (df['is_rush_hour'] * 3) + \
                           (df['is_weekend'] * -1) + \
                           np.random.normal(0, 1, n_samples)

print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# Prepare features and target
features = ['stop_sequence', 'distance_km', 'hour', 'is_rush_hour', 'is_weekend']
available_features = [f for f in features if f in df.columns]

X = df[available_features]
y = df['travel_time_min']

print(f"\nUsing features: {available_features}")
print(f"Target: travel_time_min")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

# Train model
print("\nTraining Random Forest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

print(f"\n=== MODEL PERFORMANCE ===")
print(f"Mean Absolute Error (MAE): {mae:.2f} minutes")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f} minutes")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': available_features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\n=== FEATURE IMPORTANCE ===")
print(feature_importance)

# Visualization
plt.figure(figsize=(12, 4))

# Actual vs Predicted
plt.subplot(1, 2, 1)
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel('Actual Travel Time (min)')
plt.ylabel('Predicted Travel Time (min)')
plt.title('Actual vs Predicted Travel Time')

# Feature importance
plt.subplot(1, 2, 2)
plt.barh(feature_importance['feature'], feature_importance['importance'])
plt.xlabel('Importance')
plt.title('Feature Importance')

plt.tight_layout()
plt.savefig('simple_model_results.png', dpi=300, bbox_inches='tight')
plt.show()

# Example prediction
print(f"\n=== EXAMPLE PREDICTION ===")
sample_data = X_test.iloc[0:1]
actual_time = y_test.iloc[0]
predicted_time = model.predict(sample_data)[0]

print(f"Sample features:")
for feature in available_features:
    print(f"  {feature}: {sample_data[feature].values[0]}")
print(f"Actual travel time: {actual_time:.2f} minutes")
print(f"Predicted travel time: {predicted_time:.2f} minutes")
print(f"Prediction error: {abs(actual_time - predicted_time):.2f} minutes")

# Save model results
results_df = pd.DataFrame({
    'Actual': y_test,
    'Predicted': y_pred
})
results_df.to_csv('model_predictions.csv', index=False)
print(f"\nPredictions saved to 'model_predictions.csv'")
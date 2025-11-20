import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

# --------------------------------------------------
# 1. Load or generate sample data
# --------------------------------------------------

def load_data():
    try:
        df = pd.read_csv("transconnect_processed_data.csv")
    except:
        print("Dataset not found. Generating sample data...")
        df = pd.DataFrame({
            'latitude': np.random.uniform(-1.95, -1.97, 100),
            'longitude': np.random.uniform(30.10, 30.22, 100),
            'stop_sequence': np.arange(100),
            'distance_to_next': np.random.uniform(0.1, 2.0, 100),
            'cumulative_distance': np.cumsum(np.random.uniform(0.1, 2.0, 100)),
            'estimated_travel_time_min': np.random.uniform(0.5, 10, 100),
            'hour': np.random.randint(5, 22, 100),
            'day_of_week': np.random.randint(0, 7, 100)
        })
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['is_rush_hour'] = ((df['hour'] >= 7) & (df['hour'] <= 9) |
                              (df['hour'] >= 16) & (df['hour'] <= 19)).astype(int)
    return df


# --------------------------------------------------
# 2. Feature setup
# --------------------------------------------------

def prepare_features(df):
    feature_columns = [
        'latitude', 'longitude', 'stop_sequence',
        'distance_to_next', 'cumulative_distance',
        'hour', 'day_of_week', 'is_weekend', 'is_rush_hour'
    ]

    X = df[feature_columns]
    y = df["estimated_travel_time_min"]
    return X, y


# --------------------------------------------------
# 3. Train and compare models
# --------------------------------------------------

def compare_models(X, y):
    # split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # -------- Linear Regression --------
    lr = LinearRegression()
    lr.fit(X_train_scaled, y_train)
    lr_pred = lr.predict(X_test_scaled)

    # -------- Random Forest --------
    rf = RandomForestRegressor(n_estimators=150, random_state=42)
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)

    # -------- Evaluation --------
    results = pd.DataFrame({
        'Model': ['Linear Regression', 'Random Forest'],
        'MAE': [
            mean_absolute_error(y_test, lr_pred),
            mean_absolute_error(y_test, rf_pred)
        ],
        'MSE': [
            mean_squared_error(y_test, lr_pred),
            mean_squared_error(y_test, rf_pred)
        ],
        'RMSE': [
            np.sqrt(mean_squared_error(y_test, lr_pred)),
            np.sqrt(mean_squared_error(y_test, rf_pred))
        ],
        'R² Score': [
            r2_score(y_test, lr_pred),
            r2_score(y_test, rf_pred)
        ]
    })

    print("\n===== MODEL PERFORMANCE COMPARISON =====\n")
    print(results.to_string(index=False))

    return results, y_test, lr_pred, rf_pred


# --------------------------------------------------
# 4. Visualization
# --------------------------------------------------

def visualize_results(y_test, lr_pred, rf_pred):
    plt.figure(figsize=(14, 6))

    # Compare predictions
    plt.subplot(1, 2, 1)
    plt.scatter(y_test, lr_pred, label='Linear Regression', alpha=0.6)
    plt.scatter(y_test, rf_pred, label='Random Forest', alpha=0.6)
    plt.plot([y_test.min(), y_test.max()],
             [y_test.min(), y_test.max()],
             'k--', linewidth=2)
    plt.xlabel("Actual Values")
    plt.ylabel("Predicted Values")
    plt.title("Actual vs Predicted")
    plt.legend()

    # Error distribution
    plt.subplot(1, 2, 2)
    plt.hist(y_test - lr_pred, bins=20, alpha=0.6, label="Linear Regression")
    plt.hist(y_test - rf_pred, bins=20, alpha=0.6, label="Random Forest")
    plt.xlabel("Residuals (Actual - Predicted)")
    plt.ylabel("Frequency")
    plt.title("Error Distribution")
    plt.legend()

    plt.tight_layout()
    plt.show()


# --------------------------------------------------
# 5. Main function
# --------------------------------------------------

def main():
    df = load_data()
    X, y = prepare_features(df)
    results, y_test, lr_pred, rf_pred = compare_models(X, y)
    visualize_results(y_test, lr_pred, rf_pred)


if __name__ == "__main__":
    main()

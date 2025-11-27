import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pickle
import os

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor


class TransConnectModel:
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.models = {
            "Linear Regression": LinearRegression(),
            "Decision Tree": DecisionTreeRegressor(max_depth=6),
            "Random Forest": RandomForestRegressor(n_estimators=200),
            "Gradient Boosting": GradientBoostingRegressor(
                n_estimators=200,
                learning_rate=0.05
            )
        }
        self.results = {}
        self.best_model_name = None
        self.best_model = None


    # ---------------------------------------------------------
    # Load and Prepare Data
    # ---------------------------------------------------------
    def load_data(self, df=None):
        """
        If df is not provided, generate synthetic route data.
        """
        if df is not None:
            print("Loading provided dataset...")
            return df
        
        print("Dataset missing — generating synthetic Kabuga→Nyabugogo data...")

        distance = np.linspace(0, 26, 200)

        normal_time = (distance / 45) * 60 + np.random.normal(0, 1.2, len(distance))
        traffic_time = (distance / 35) * 60 + np.random.normal(0, 2.0, len(distance))

        df = pd.DataFrame({
            "distance": np.concatenate([distance, distance]),
            "condition": ["normal"] * len(distance) + ["traffic"] * len(distance),
            "travel_time": np.concatenate([normal_time, traffic_time])
        })

        df["is_traffic"] = (df["condition"] == "traffic").astype(int)
        df["hour"] = np.random.randint(6, 20, len(df))

        return df


    # ---------------------------------------------------------
    # Feature Engineering
    # ---------------------------------------------------------
    def create_features(self, df):
        features = ["distance", "is_traffic", "hour"]
        X = df[features]
        y = df["travel_time"]
        return X, y
    

    # ---------------------------------------------------------
    # Train and Compare the Four Models
    # ---------------------------------------------------------
    def train_all_models(self, X, y):

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=42
        )

        X_train_s = self.scaler.fit_transform(X_train)
        X_test_s = self.scaler.transform(X_test)

        print("\nTraining all models...\n")

        for name, model in self.models.items():

            model.fit(X_train_s, y_train)
            preds = model.predict(X_test_s)

            mae = mean_absolute_error(y_test, preds)
            mse = mean_squared_error(y_test, preds)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_test, preds)

            self.results[name] = {
                "model": model,
                "mae": mae,
                "mse": mse,
                "rmse": rmse,
                "r2": r2,
                "preds": preds,
                "y_test": y_test
            }

            print(f"{name}:  RMSE={rmse:.2f}, R²={r2:.3f}")

        # Identify Best Model (Highest R²)
        self.best_model_name = max(self.results, key=lambda m: self.results[m]["r2"])
        self.best_model = self.results[self.best_model_name]["model"]

        print("\n======================================")
        print(f" BEST MODEL: {self.best_model_name}")
        print("======================================\n")

        return self.results


    # ---------------------------------------------------------
    # Save Best Model (Improved)
    # ---------------------------------------------------------
    def save_best_model(self, filename="best_transconnect_model.pkl"):
        
        # Ensure folder exists
        folder = os.path.dirname(filename)
        if folder != "" and not os.path.exists(folder):
            os.makedirs(folder, exist_ok=True)

        if self.best_model is None:
            raise Exception("❌ ERROR: No model trained. Run train_all_models() first.")

        with open(filename, "wb") as f:
            pickle.dump({
                "scaler": self.scaler,
                "model": self.best_model,
                "model_name": self.best_model_name
            }, f)

        print(f"\n✅ Best model saved successfully: {filename}\n")


    # ---------------------------------------------------------
    # Predict with Best Model
    # ---------------------------------------------------------
    def predict(self, sample_feature_array):
        sample_scaled = self.scaler.transform([sample_feature_array])
        return float(self.best_model.predict(sample_scaled))


    # ---------------------------------------------------------
    # Visualization (Model Comparison)
    # ---------------------------------------------------------
    def visualize_model_performance(self):
        
        model_names = list(self.results.keys())
        r2_scores = [self.results[m]["r2"] for m in model_names]
        rmse_scores = [self.results[m]["rmse"] for m in model_names]

        plt.figure(figsize=(12, 5))

        # R² Comparison
        plt.subplot(1, 2, 1)
        plt.bar(model_names, r2_scores, color="green")
        plt.title("R² Score Comparison")
        plt.xticks(rotation=20)
        plt.ylabel("R² Value")

        # RMSE Comparison
        plt.subplot(1, 2, 2)
        plt.bar(model_names, rmse_scores, color="orange")
        plt.title("RMSE Comparison")
        plt.xticks(rotation=20)
        plt.ylabel("RMSE Value")

        plt.tight_layout()
        plt.show()

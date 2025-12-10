import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
import tensorflow as tf

import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor


# ======================================================
# 1. Generate Synthetic Dataset (Kabuga → Nyabugogo)
# ======================================================
def generate_transconnect_data():
    np.random.seed(42)

    distance = np.linspace(0, 26, 260)

    normal = (distance / 45) * 60 + np.random.normal(0, 1.2, len(distance))
    traffic = (distance / 35) * 60 + np.random.normal(0, 2.0, len(distance))

    df = pd.DataFrame({
        "distance": np.concatenate([distance, distance]),
        "condition": ["normal"] * len(distance) + ["traffic"] * len(distance),
        "travel_time": np.concatenate([normal, traffic])
    })

    df["is_traffic"] = (df["condition"] == "traffic").astype(int)
    df["hour"] = np.random.randint(6, 20, len(df))

    return df


df = generate_transconnect_data()


# ======================================================
# 2. Correlation Matrix
# ======================================================
plt.figure(figsize=(7, 5))
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="Blues")
plt.title("TransConnect Feature Correlation Matrix")
plt.show()


# ======================================================
# 3. Prepare Features
# ======================================================
X = df[["distance", "is_traffic", "hour"]]
y = df["travel_time"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.25, random_state=42
)


# ======================================================
# 4. Define ML Models (4)
# ======================================================
models = {
    "Linear Regression": LinearRegression(),
    "Decision Tree": DecisionTreeRegressor(max_depth=6),
    "Random Forest": RandomForestRegressor(n_estimators=200),
    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=200, learning_rate=0.05, max_depth=3
    )
}


# ======================================================
# 5. Train ML Models
# ======================================================
results = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    mae = mean_absolute_error(y_test, preds)
    mse = mean_squared_error(y_test, preds)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, preds)

    results[name] = {
        "model": model,
        "mae": mae,
        "mse": mse,
        "rmse": rmse,
        "r2": r2,
        "preds": preds
    }

    print(f"{name}: R² = {r2:.4f}, RMSE = {rmse:.3f}")


# ======================================================
# 6. Train LSTM (Deep Learning Model)
# ======================================================
X_lstm_train = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))
X_lstm_test = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))

lstm_model = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, activation='tanh', input_shape=(1, 3)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1)
])

lstm_model.compile(optimizer='adam', loss='mse')

history = lstm_model.fit(
    X_lstm_train, y_train,
    validation_data=(X_lstm_test, y_test),
    epochs=40,
    batch_size=16,
    verbose=0
)

lstm_preds = lstm_model.predict(X_lstm_test)

mae = mean_absolute_error(y_test, lstm_preds)
mse = mean_squared_error(y_test, lstm_preds)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, lstm_preds)

results["LSTM"] = {
    "model": lstm_model,
    "mae": mae,
    "mse": mse,
    "rmse": rmse,
    "r2": r2,
    "preds": lstm_preds
}

print(f"LSTM: R² = {r2:.4f}, RMSE = {rmse:.3f}")


# ======================================================
# 7. Metric Table for All Models
# ======================================================
metrics_table = pd.DataFrame({
    "Model": list(results.keys()),
    "MAE": [results[m]["mae"] for m in results],
    "MSE": [results[m]["mse"] for m in results],
    "RMSE": [results[m]["rmse"] for m in results],
    "R²": [results[m]["r2"] for m in results]
})

print("\n===== METRICS TABLE =====\n")
print(metrics_table)


# ======================================================
# 8. Identify Best Model (Highest R²)
# ======================================================
best_model_name = metrics_table.sort_values(by="R²", ascending=False).iloc[0]["Model"]
best_model = results[best_model_name]["model"]

print("\n===========================================")
print(f" BEST MODEL: {best_model_name}")
print("===========================================\n")


# ======================================================
# 9. Save Best Model — .h5 or .pkl Format
# ======================================================
if best_model_name == "LSTM":
    best_model.save("best_transconnect_model.h5")
else:
    # Save ML models as h5 using tensorflow wrapper
    joblib.dump(best_model, "best_transconnect_model.pkl")

joblib.dump(scaler, "scaler.pkl") # Save scaler for future use

print("Saved:", "best_transconnect_model.h5" if best_model_name == "LSTM" else "best_transconnect_model.pkl")

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

# -------------------------
# 1. Generate Example Data
# -------------------------
np.random.seed(42)

# Distances along route (Kabuga–Nyabugogo)
distances = np.linspace(0, 15, 60)

# Normal day (45 km/h)
normal_time = (distances / 45) * 60 + np.random.normal(0, 0.8, len(distances))

# Traffic (35 km/h)
traffic_time = (distances / 35) * 60 + np.random.normal(0, 1.2, len(distances))

df = pd.DataFrame({
    "distance": np.concatenate([distances, distances]),
    "condition": ["normal"] * len(distances) + ["traffic"] * len(distances),
    "travel_time": np.concatenate([normal_time, traffic_time])
})

df["is_traffic"] = (df["condition"] == "traffic").astype(int)

X = df[["distance", "is_traffic"]]
y = df["travel_time"]

# -------------------------
# 2. Train-Test Split
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------
# 3. Train Linear Regression
# -------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lr = LinearRegression()
lr.fit(X_train_scaled, y_train)
lr_pred = lr.predict(X_test_scaled)

# -------------------------
# 4. Train Random Forest
# -------------------------
rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)

# -------------------------
# 5. Metrics Function
# -------------------------
def compute_metrics(y_true, y_pred):
    return {
        "MAE": mean_absolute_error(y_true, y_pred),
        "MSE": mean_squared_error(y_true, y_pred),
        "RMSE": np.sqrt(mean_squared_error(y_true, y_pred)),
        "R²": r2_score(y_true, y_pred)
    }

lr_metrics = compute_metrics(y_test, lr_pred)
rf_metrics = compute_metrics(y_test, rf_pred)

# -------------------------
# 6. Combine Metrics
# -------------------------
results = pd.DataFrame([lr_metrics, rf_metrics], index=["Linear Regression", "Random Forest"])
print("\nMODEL PERFORMANCE COMPARISON:")
print(results)

# -------------------------
# 7. Visualization
# -------------------------
plt.figure(figsize=(15, 10))

# --- Actual vs Predicted ---
plt.subplot(2, 2, 1)
plt.scatter(y_test, lr_pred, label="Linear Regression", alpha=0.7)
plt.scatter(y_test, rf_pred, label="Random Forest", alpha=0.7, color='green')
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--")
plt.xlabel("Actual Travel Time (min)")
plt.ylabel("Predicted Travel Time (min)")
plt.title("Actual vs Predicted")
plt.legend()

# --- Residuals ---
plt.subplot(2, 2, 2)
plt.scatter(lr_pred, y_test - lr_pred, label="Linear Regression Residuals")
plt.scatter(rf_pred, y_test - rf_pred, label="Random Forest Residuals")
plt.axhline(0, color="red", linestyle="--")
plt.xlabel("Predicted")
plt.ylabel("Residuals")
plt.title("Residual Plot")
plt.legend()

# --- Metrics Bar Chart ---
plt.subplot(2, 1, 2)
metrics_names = ["MAE", "RMSE", "R²"]
lr_vals = [lr_metrics["MAE"], lr_metrics["RMSE"], lr_metrics["R²"]]
rf_vals = [rf_metrics["MAE"], rf_metrics["RMSE"], rf_metrics["R²"]]

x = np.arange(len(metrics_names))
width = 0.35

plt.bar(x - width/2, lr_vals, width, label="Linear Regression")
plt.bar(x + width/2, rf_vals, width, label="Random Forest")

plt.xticks(x, metrics_names)
plt.ylabel("Score")
plt.title("Model Metrics Comparison")
plt.legend()

plt.tight_layout()
plt.show()

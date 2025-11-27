import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

# ---------------------------------------------------------
# 1. Synthetic Data (Kabuga → Nyabugogo)
# ---------------------------------------------------------
np.random.seed(42)

distance = np.linspace(0, 26, 120)

normal_time = (distance / 45) * 60 + np.random.normal(0, 1.2, len(distance))
traffic_time = (distance / 35) * 60 + np.random.normal(0, 2.0, len(distance))

df = pd.DataFrame({
    "distance": np.concatenate([distance, distance]),
    "condition": ["normal"] * len(distance) + ["traffic"] * len(distance),
    "travel_time": np.concatenate([normal_time, traffic_time])
})

df["is_traffic"] = (df["condition"] == "traffic").astype(int)

# ---------------------------------------------------------
# 2. Train-Test Split
# ---------------------------------------------------------
X = df[["distance", "is_traffic"]]
y = df["travel_time"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# ---------------------------------------------------------
# 3. Models
# ---------------------------------------------------------
models = {
    "Decision Tree": DecisionTreeRegressor(max_depth=5),
    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=200, learning_rate=0.05
    )
}

results = {}

# ---------------------------------------------------------
# 4. Train + Compute Metrics
# ---------------------------------------------------------
for name, model in models.items():
    model.fit(X_train_s, y_train)
    pred = model.predict(X_test_s)
    residuals = y_test - pred

    mae = mean_absolute_error(y_test, pred)
    mse = mean_squared_error(y_test, pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, pred)

    results[name] = {
        "pred": pred,
        "resid": residuals,
        "metrics": {"MAE": mae, "MSE": mse, "RMSE": rmse, "R2": r2},
    }

# ---------------------------------------------------------
# 5. FINAL PLOT — ONE FIGURE WITH 3 SUBPLOTS
# ---------------------------------------------------------
plt.figure(figsize=(15, 10))

# ---------------------------------------------------------
# Subplot 1 — ACTUAL vs PREDICTED
# ---------------------------------------------------------
plt.subplot(2, 2, 1)
plt.scatter(y_test, results["Decision Tree"]["pred"], label="Decision Tree", alpha=0.7)
plt.scatter(y_test, results["Gradient Boosting"]["pred"], label="Gradient Boosting", alpha=0.7)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--", lw=2)
plt.title("Actual vs Predicted (DT vs GB)")
plt.xlabel("Actual Travel Time (min)")
plt.ylabel("Predicted Travel Time (min)")
plt.legend()

# ---------------------------------------------------------
# Subplot 2 — RESIDUALS
# ---------------------------------------------------------
plt.subplot(2, 2, 2)
plt.scatter(results["Decision Tree"]["pred"],
            results["Decision Tree"]["resid"],
            label="Decision Tree Residuals", alpha=0.7)

plt.scatter(results["Gradient Boosting"]["pred"],
            results["Gradient Boosting"]["resid"],
            label="Gradient Boosting Residuals", alpha=0.7)

plt.axhline(0, color="red", linestyle="--")
plt.title("Residuals Comparison")
plt.xlabel("Predicted Travel Time (min)")
plt.ylabel("Residuals")
plt.legend()

# ---------------------------------------------------------
# Subplot 3 — METRICS BAR CHART
# ---------------------------------------------------------
plt.subplot(2, 1, 2)

metric_names = ["MAE", "MSE", "RMSE", "R2"]
dt_vals = [results["Decision Tree"]["metrics"][m] for m in metric_names]
gb_vals = [results["Gradient Boosting"]["metrics"][m] for m in metric_names]

x = np.arange(len(metric_names))
width = 0.35

plt.bar(x - width/2, dt_vals, width, label="Decision Tree")
plt.bar(x + width/2, gb_vals, width, label="Gradient Boosting")

plt.title("Model Metrics Comparison")
plt.xticks(x, metric_names)
plt.ylabel("Metric Value")
plt.legend()

# Add labels on bars
for i, v in enumerate(dt_vals):
    plt.text(i - width/2, v + 0.01, f"{v:.2f}", ha="center", fontsize=8)

for i, v in enumerate(gb_vals):
    plt.text(i + width/2, v + 0.01, f"{v:.2f}", ha="center", fontsize=8)

plt.tight_layout()
plt.show()

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# -------------------------
# 1. Generate Synthetic Data (Kabuga → Nyabugogo)
# -------------------------
np.random.seed(42)

distances = np.linspace(0, 26, 100)  # 26 km real route

normal_speed = 31.2  # 50 min
traffic_speed = 17.3 # 90 min

normal_time = (distances / normal_speed) * 60 + np.random.normal(0, 1.5, len(distances))
traffic_time = (distances / traffic_speed) * 60 + np.random.normal(0, 2.5, len(distances))

df = pd.DataFrame({
    "distance": np.concatenate([distances, distances]),
    "condition": ["normal"] * len(distances) + ["traffic"] * len(distances),
    "travel_time": np.concatenate([normal_time, traffic_time])
})

df["is_traffic"] = (df["condition"] == "traffic").astype(int)

# -------------------------
# 2. Features / Target
# -------------------------
X = df[["distance", "is_traffic"]]
y = df["travel_time"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# -------------------------
# 3. Train Decision Tree
# -------------------------
model = DecisionTreeRegressor(max_depth=6, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
residuals = y_test - y_pred

# -------------------------
# 4. Metrics
# -------------------------
mae  = mean_absolute_error(y_test, y_pred)
mse  = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2   = r2_score(y_test, y_pred)

metrics_text = (
    f"MAE:  {mae:.2f}\n"
    f"MSE:  {mse:.2f}\n"
    f"RMSE: {rmse:.2f}\n"
    f"R²:   {r2:.3f}"
)

# -------------------------
# 5. Plots (4 Graphs)
# -------------------------
plt.figure(figsize=(12, 8))

# 1—Actual vs Predicted
plt.subplot(2,2,1)
plt.scatter(y_test, y_pred, alpha=0.7)
plt.plot([y_test.min(),y_test.max()],[y_test.min(),y_test.max()],'r--')
plt.title("Decision Tree — Actual vs Predicted")
plt.xlabel("Actual (min)")
plt.ylabel("Predicted (min)")
plt.gca().text(0.05,0.95,metrics_text,transform=plt.gca().transAxes,
               bbox=dict(facecolor='white',edgecolor='black',alpha=0.8),fontsize=8)

# 2—Residual Plot
plt.subplot(2,2,2)
plt.scatter(y_pred, residuals, alpha=0.7)
plt.axhline(0, color="red", linestyle="--")
plt.title("Decision Tree — Residual Plot")
plt.xlabel("Predicted")
plt.ylabel("Residuals")
plt.gca().text(0.05,0.95,metrics_text,transform=plt.gca().transAxes,
               bbox=dict(facecolor='white',edgecolor='black',alpha=0.8),fontsize=8)

# 3—Error Distribution
plt.subplot(2,2,3)
plt.hist(residuals, bins=20, alpha=0.7, edgecolor="black")
plt.title("Decision Tree — Error Distribution")
plt.xlabel("Error")
plt.ylabel("Frequency")
plt.gca().text(0.05,0.95,metrics_text,transform=plt.gca().transAxes,
               bbox=dict(facecolor='white',edgecolor='black',alpha=0.8),fontsize=8)

# 4—Predicted vs Distance
plt.subplot(2,2,4)
plt.scatter(X_test["distance"], y_test, label="Actual", alpha=0.7)
plt.scatter(X_test["distance"], y_pred, label="Predicted", alpha=0.7)
plt.title("Decision Tree — Travel Time Along Route")
plt.xlabel("Distance (km)")
plt.ylabel("Travel Time (min)")
plt.legend()
plt.gca().text(0.05,0.95,metrics_text,transform=plt.gca().transAxes,
               bbox=dict(facecolor='white',edgecolor='black',alpha=0.8),fontsize=8)

plt.tight_layout()
plt.show()

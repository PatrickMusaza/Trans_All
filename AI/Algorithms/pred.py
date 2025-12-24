import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

import tensorflow as tf

# ======================================================
# 1. Generate Synthetic Dataset
# ======================================================
np.random.seed(42)

distances = np.linspace(0, 26, 100)

normal_speed = 31.2
traffic_speed = 17.3

normal_time = (distances / normal_speed) * 60 + np.random.normal(0, 1.5, len(distances))
traffic_time = (distances / traffic_speed) * 60 + np.random.normal(0, 2.5, len(distances))

df = pd.DataFrame({
    "distance": np.concatenate([distances, distances]),
    "condition": ["normal"] * len(distances) + ["traffic"] * len(distances),
    "travel_time": np.concatenate([normal_time, traffic_time])
})

# NORMAL condition only
df = df[df["condition"] == "traffic"]

df["is_traffic"] = 0

# ======================================================
# 2. Features & Target
# ======================================================
X = df[["distance", "is_traffic"]]
y = df["travel_time"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.25, random_state=42
)

# ======================================================
# 3. Train ML Models
# ======================================================
models = {
    "Linear Regression": LinearRegression(),
    "Decision Tree": DecisionTreeRegressor(max_depth=6),
    "Random Forest": RandomForestRegressor(n_estimators=200),
    "Gradient Boosting": GradientBoostingRegressor(n_estimators=200)
}
captions = {
    "Linear Regression": "(a)",
    "Decision Tree": "(b)",
    "Random Forest": "(c)",
    "Gradient Boosting": "(d)",
    "LSTM": "(e)"
}
results = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    results[name] = model.predict(X_test)

# ======================================================
# 4. Train LSTM
# ======================================================
X_lstm_train = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))
X_lstm_test = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))

lstm = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, input_shape=(1, 2)),
    tf.keras.layers.Dense(1)
])

lstm.compile(optimizer="adam", loss="mse")
lstm.fit(X_lstm_train, y_train, epochs=30, verbose=0)

results["LSTM"] = lstm.predict(X_lstm_test).flatten()

# ======================================================
# 5. Percentage Error Function
# ======================================================
def percentage_error(y_true, y_pred):
    return ((y_pred - y_true.values) / y_true.values) * 100

# ======================================================
# 6. Error Scatter Plots
# ======================================================
fig, axes = plt.subplots(3, 2, figsize=(13, 6))
axes = axes.flatten()

for i, (name, preds) in enumerate(results.items()):
    errors = percentage_error(y_test, preds)
    axes[i].scatter(y_test, errors, alpha=0.6)
    axes[i].axhline(0, linestyle="--")
    axes[i].set_title(name)
    axes[i].set_xlabel("Actual Travel Time (minutes)")
    axes[i].set_ylabel("Prediction Error (%)")
    axes[i].grid(True)
    axes[i].text(
        0.5, -0.25,
        r"$\mathbf{" + captions[name] + "}$",
        transform=axes[i].transAxes,
        ha="center",
        fontsize=9
    )

fig.delaxes(axes[-1])


plt.tight_layout(rect=[0, 0.03, 1, 0.95])
plt.show()

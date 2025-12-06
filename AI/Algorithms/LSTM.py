import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ----------------------------------------------------------
# 1. GENERATE SYNTHETIC TRANSCONNECT DATA
# ----------------------------------------------------------
np.random.seed(42)

distance = np.linspace(0, 26, 300)

normal = (distance / 45) * 60 + np.random.normal(0, 1, len(distance))
traffic = (distance / 35) * 60 + np.random.normal(0, 2, len(distance))

df = pd.DataFrame({
    "distance": np.concatenate([distance, distance]),
    "is_traffic": np.concatenate([np.zeros(len(distance)), np.ones(len(distance))]),
    "hour": np.random.randint(6, 20, len(distance) * 2),
    "travel_time": np.concatenate([normal, traffic])
})


# ----------------------------------------------------------
# 2. FEATURE SELECTION
# ----------------------------------------------------------
X = df[["distance", "is_traffic", "hour"]]
y = df["travel_time"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


# ----------------------------------------------------------
# 3. SPLIT DATA
# ----------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.25, random_state=42
)

# Reshape for LSTM → (samples, timesteps, features)
X_train_lstm = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))
X_test_lstm  = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))


# ----------------------------------------------------------
# 4. BUILD LSTM MODEL
# ----------------------------------------------------------
lstm_model = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, activation='tanh', input_shape=(1, 3)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1)
])

lstm_model.compile(optimizer='adam', loss='mse')
lstm_model.summary()


# ----------------------------------------------------------
# 5. TRAIN MODEL
# ----------------------------------------------------------
history = lstm_model.fit(
    X_train_lstm, y_train,
    validation_split=0.2,
    epochs=40,
    batch_size=16,
    verbose=1
)


# ----------------------------------------------------------
# 6. PREDICT
# ----------------------------------------------------------
y_pred = lstm_model.predict(X_test_lstm).flatten()


# ----------------------------------------------------------
# 7. METRICS
# ----------------------------------------------------------
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("\n===== LSTM MODEL PERFORMANCE =====")
print(f"MAE:  {mae:.3f}")
print(f"MSE:  {mse:.3f}")
print(f"RMSE: {rmse:.3f}")
print(f"R²:   {r2:.3f}")


# ----------------------------------------------------------
# 8. VISUALIZATIONS
# ----------------------------------------------------------
plt.figure(figsize=(15, 10))


# --- (1) Actual vs Predicted ---
plt.subplot(2, 2, 1)
plt.scatter(y_test, y_pred, alpha=0.6, color='blue')
plt.plot([y_test.min(), y_test.max()],
         [y_test.min(), y_test.max()],
         'r--')
plt.title("Actual vs Predicted (LSTM)")
plt.xlabel("Actual Travel Time (min)")
plt.ylabel("Predicted Travel Time (min)")


# --- (2) Residuals ---
residuals = y_test - y_pred
plt.subplot(2, 2, 2)
plt.scatter(y_pred, residuals, alpha=0.6)
plt.axhline(0, color='red', linestyle='--')
plt.title("Residual Plot (LSTM)")
plt.xlabel("Predicted")
plt.ylabel("Residuals")


# --- (3) Training Loss ---
plt.subplot(2, 2, 3)
plt.plot(history.history['loss'], label="Train Loss")
plt.plot(history.history['val_loss'], label="Validation Loss")
plt.title("LSTM Training Curve")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend()


# --- (4) Metrics Bar Chart ---
plt.subplot(2, 2, 4)
metrics = ["MAE", "RMSE", "R²"]
values = [mae, rmse, r2]
plt.bar(metrics, values, color=["orange", "green", "purple"])
plt.title("LSTM Metrics Overview")


plt.tight_layout()
plt.show()

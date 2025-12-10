import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler

# ===========================================================
# 1. CREATE SAMPLE DATASET (Illustration)
# ===========================================================

np.random.seed(42)

N = 300

df = pd.DataFrame({
    "distance_to_next": np.random.uniform(0.2, 5.0, N),             # in km
    "estimated_travel_time_min": np.random.uniform(2, 20, N),       # rough estimate
    "route_segment": np.random.choice([
        "kabuga→remera", "remera→sonatube",
        "sonatube→rwandex", "rwandex→nyabugogo"
    ], N),
    "travel_time_category": np.random.choice(["short", "medium", "long"], N),
    "condition": np.random.choice(["normal", "rush_hour"], N),
    "timestamp": pd.date_range("2024-01-01", periods=N, freq="H")
})

# ===========================================================
# 2. FEATURE ENGINEERING
# ===========================================================

# ---- Binary traffic condition ----
df["is_rush_hour"] = (df["condition"] == "rush_hour").astype(int)

# ---- Temporal Features ----
df["hour_of_day"] = df["timestamp"].dt.hour
df["day_of_week"] = df["timestamp"].dt.dayofweek     # 0=Monday
df["is_weekend"]  = df["day_of_week"].isin([5, 6]).astype(int)

# ---- Create realistic target variable ----
# travel_time = base_speed_effect + traffic_penalty + noise
df["actual_travel_time_min"] = (
    df["distance_to_next"] * (5 + df["is_rush_hour"] * 3) * 1.8
    + np.random.normal(0, 2, N)
)

# ===========================================================
# 3. ONE-HOT ENCODING FOR CATEGORICAL FEATURES
# ===========================================================

df = pd.get_dummies(df,
                    columns=["route_segment", "travel_time_category"],
                    drop_first=True)

# ===========================================================
# 4. SELECT FEATURES FOR MODELING
# ===========================================================

feature_cols = [
    "distance_to_next",
    "estimated_travel_time_min",
    "is_rush_hour",
    "hour_of_day",
    "day_of_week",
    "is_weekend",
] + [c for c in df.columns if "route_segment_" in c] \
  + [c for c in df.columns if "travel_time_category_" in c]

X = df[feature_cols]
y = df["actual_travel_time_min"]

# ===========================================================
# 5. TRAIN / TEST SPLIT
# ===========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# ===========================================================
# 6. TRAIN RANDOM FOREST MODEL
# ===========================================================

model = RandomForestRegressor(
    n_estimators=250,
    max_depth=12,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)


# ===========================================================
# 8. FEATURE IMPORTANCE PLOT
# ===========================================================

importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
sorted_features = [feature_cols[i] for i in indices]

plt.figure()
plt.barh(sorted_features, importances[indices], color="skyblue")
plt.title("Feature Importance (Random Forest)", fontsize=16)
plt.xlabel("Importance")
plt.gca().invert_yaxis()
plt.show()

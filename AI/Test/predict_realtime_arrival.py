import numpy as np
import joblib
import tensorflow as tf
import math
import os


def find_file(filename, search_dir):
    for root, dirs, files in os.walk(search_dir):
        if filename in files:
            return os.path.join(root, filename)
    return None


# =====================================================
# 1. LOAD BEST MODEL (.h5 or .pkl) + SCALER
# =====================================================
def load_transconnect_model():

    BASE = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE, ".."))

    # Search for model in all folders (Model, Algorithms, Test, Preprocessing, etc.)
    h5_path = find_file("best_transconnect_model.h5", PROJECT_ROOT)
    pkl_path = find_file("best_transconnect_model.pkl", PROJECT_ROOT)
    scaler_path = find_file("scaler.pkl", PROJECT_ROOT)

    print("Detected model paths:")
    print("H5:", h5_path)
    print("PKL:", pkl_path)
    print("Scaler:", scaler_path)

    if not scaler_path:
        raise FileNotFoundError("Scaler file 'scaler.pkl' not found!")

    scaler = joblib.load(scaler_path)

    if h5_path:
        print("Loading LSTM model (.h5)...")
        model = tf.keras.models.load_model(h5_path, compile=False)
        return model, "LSTM", scaler

    elif pkl_path:
        print("Loading ML model (.pkl)...")
        model = joblib.load(pkl_path)
        return model, "ML", scaler

    else:
        raise FileNotFoundError("No model (.h5 or .pkl) found anywhere in project!")
    


model, model_type, scaler = load_transconnect_model()


# =====================================================
# 2. HAVERSINE FORMULA — Convert Coordinates → KM
# =====================================================
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius (km)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon/2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# =====================================================
# 3. PREDICT USING DISTANCE (km), CONDITION, HOUR
# =====================================================
def predict_travel_time(distance_km, condition="normal", hour=12):
    
    # Convert condition to numeric feature
    is_traffic = 1 if condition.lower() == "traffic" else 0

    # Build feature array
    features = np.array([[distance_km, is_traffic, hour]])

    # Scale features
    features_scaled = scaler.transform(features)

    # Predict using correct model type
    if model_type == "LSTM":
        # LSTM expects shape: (batch, timesteps, features)
        prediction = model.predict(features_scaled.reshape(1, 1, 3))[0][0]
    else:
        prediction = model.predict(features_scaled)[0]

    return float(prediction)


# =====================================================
# 4. PREDICT USING COORDINATES
# =====================================================
def predict_from_coordinates(lat1, lon1, lat2, lon2, condition="normal", hour=12):

    distance = haversine_distance(lat1, lon1, lat2, lon2)
    eta = predict_travel_time(distance, condition, hour)

    print("\n==============================")
    print("       TRANSCONNECT ETA       ")
    print("==============================")
    print(f"Distance: {distance:.2f} km")
    print(f"Predicted Travel Time: {eta:.2f} minutes")
    print(f"Traffic Condition: {condition}")
    print(f"Hour of Day: {hour}:00")
    print("==============================\n")

    return eta, distance


# =====================================================
# 5. QUICK EXAMPLES TO TEST SYSTEM
# =====================================================
if __name__ == "__main__":

    print("\n=== EXAMPLE 1: Predict Using Distance ===")
    predict_travel_time(26, "traffic", 8)

    print("\n=== EXAMPLE 2: Predict Using Coordinates ===")
    # Kabuga Taxi Park → Nyabugogo Taxi Park (approx)
    kabuga_lat, kabuga_lon = -1.949, 30.150
    nyabugogo_lat, nyabugogo_lon = -1.940, 30.058

    predict_from_coordinates(
        kabuga_lat, kabuga_lon,
        nyabugogo_lat, nyabugogo_lon,
        condition="traffic",
        hour=7
    )

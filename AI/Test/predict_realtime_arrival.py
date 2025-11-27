import pandas as pd
import numpy as np
import pickle
from math import radians, sin, cos, sqrt, atan2

# ----------------------------------------------------------
# 1. Load Your Saved Best Model
# ----------------------------------------------------------
def load_best_model(model_path="best_transconnect_model.pkl"):
    with open(model_path, "rb") as f:
        data = pickle.load(f)

    return data["model"], data["scaler"], data["model_name"]


# ----------------------------------------------------------
# 2. Haversine Distance (in KM)
# ----------------------------------------------------------
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius (km)

    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


# ----------------------------------------------------------
# 3. Load Route Data (Your TransConnect Stops)
# ----------------------------------------------------------
def load_route_data(route_file="transconnect_clean_route.csv"):
    df = pd.read_csv(route_file)
    df = df.sort_values("stop_sequence")
    return df


# ----------------------------------------------------------
# 4. Find Nearest Stop Based on User Location
# ----------------------------------------------------------
def find_nearest_stop(df_route, user_lat, user_lon):

    df_route["distance_from_user"] = df_route.apply(
        lambda row: haversine(user_lat, user_lon, row["latitude"], row["longitude"]),
        axis=1
    )

    nearest = df_route.iloc[df_route["distance_from_user"].idxmin()]

    return nearest


# ----------------------------------------------------------
# 5. Compute Remaining Distance
# ----------------------------------------------------------
def compute_remaining_distance(df_route, current_stop_seq):

    remaining_stops = df_route[df_route["stop_sequence"] >= current_stop_seq]
    last_stop = remaining_stops["cumulative_distance"].iloc[-1]

    current_distance = df_route[df_route["stop_sequence"] == current_stop_seq]["cumulative_distance"].values[0]

    return last_stop - current_distance


# ----------------------------------------------------------
# 6. Predict Arrival Time From ML Model
# ----------------------------------------------------------
def predict_arrival_time(model, scaler, distance_remaining, traffic_flag):

    features = np.array([[distance_remaining, traffic_flag, 12]])  
    # hour=12 (mid-day default; can be replaced with real time)

    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]

    return prediction


# ----------------------------------------------------------
# 7. MASTER FUNCTION — USE YOUR LOCATION
# ----------------------------------------------------------
def get_live_prediction(user_lat, user_lon, is_traffic):

    # Load model + scaling
    model, scaler, model_name = load_best_model()

    # Load route
    df_route = load_route_data()

    # Find nearest actual bus stop
    nearest_stop = find_nearest_stop(df_route, user_lat, user_lon)

    stop_name = nearest_stop["stop_name"]
    stop_sequence = nearest_stop["stop_sequence"]

    # Compute remaining distance
    remaining_km = compute_remaining_distance(df_route, stop_sequence)

    # Predict travel time
    predicted_time = predict_arrival_time(
        model, scaler,
        remaining_km,
        is_traffic
    )

    return {
        "nearest_stop": stop_name,
        "remaining_km": round(remaining_km, 2),
        "predicted_arrival_minutes": round(predicted_time, 1),
        "model_used": model_name
    }


# ----------------------------------------------------------
# 8. USAGE EXAMPLE
# ----------------------------------------------------------
if __name__ == "__main__":

    # Example GPS location (your real values go here)
    user_lat = -1.9443
    user_lon = 30.1030

    # 0 = normal day, 1 = heavy traffic
    traffic_flag = 1

    results = get_live_prediction(user_lat, user_lon, traffic_flag)

    print("\n======= LIVE TRANSConnect ETA Prediction =======")
    print(f"Nearest Stop: {results['nearest_stop']}")
    print(f"Remaining Distance: {results['remaining_km']} km")
    print(f"Predicted Arrival Time: {results['predicted_arrival_minutes']} minutes")
    print(f"Model Used: {results['model_used']}")
    print("=================================================\n")

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

print("=== ANOMALY DETECTION FOR TRANSCONNECT ===")

# Create sample bus data with anomalies
np.random.seed(42)
n_normal = 180
n_anomalies = 20

# Normal bus behavior
normal_data = pd.DataFrame({
    'speed_kmh': np.random.normal(25, 5, n_normal),
    'passenger_count': np.random.poisson(15, n_normal),
    'time_between_stops_min': np.random.normal(3, 0.5, n_normal)
})

# Anomalous behavior (delays, breakdowns, etc.)
anomaly_data = pd.DataFrame({
    'speed_kmh': np.random.normal(5, 2, n_anomalies),  # Very slow
    'passenger_count': np.concatenate([
        np.random.poisson(40, n_anomalies//2),  # Overcrowded
        np.random.poisson(2, n_anomalies//2)    # Empty
    ]),
    'time_between_stops_min': np.random.normal(10, 2, n_anomalies)  # Long delays
})

# Combine data
df = pd.concat([normal_data, anomaly_data], ignore_index=True)
df['is_anomaly'] = [0] * n_normal + [1] * n_anomalies

print(f"Dataset: {len(df)} records ({n_normal} normal, {n_anomalies} anomalies)")

# Prepare features
X = df[['speed_kmh', 'passenger_count', 'time_between_stops_min']]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Isolation Forest for anomaly detection
iso_forest = IsolationForest(contamination=0.1, random_state=42)
anomaly_predictions = iso_forest.fit_predict(X_scaled)

# Convert predictions: 1 = normal, -1 = anomaly
df['predicted_anomaly'] = [1 if x == -1 else 0 for x in anomaly_predictions]

# Calculate accuracy
accuracy = (df['is_anomaly'] == df['predicted_anomaly']).mean()
print(f"\nAnomaly Detection Accuracy: {accuracy:.2%}")

# Results
true_anomalies = df[df['is_anomaly'] == 1]
detected_anomalies = df[df['predicted_anomaly'] == 1]
correct_detections = df[(df['is_anomaly'] == 1) & (df['predicted_anomaly'] == 1)]

print(f"True anomalies: {len(true_anomalies)}")
print(f"Detected anomalies: {len(detected_anomalies)}")
print(f"Correctly detected: {len(correct_detections)}")

# Visualization
plt.figure(figsize=(15, 5))

# Plot 1: Speed vs Time with anomalies
plt.subplot(1, 3, 1)
normal_points = df[df['predicted_anomaly'] == 0]
anomaly_points = df[df['predicted_anomaly'] == 1]

plt.scatter(normal_points['time_between_stops_min'], normal_points['speed_kmh'], 
           alpha=0.6, label='Normal', color='blue')
plt.scatter(anomaly_points['time_between_stops_min'], anomaly_points['speed_kmh'], 
           alpha=0.8, label='Anomaly', color='red', marker='x')
plt.xlabel('Time Between Stops (min)')
plt.ylabel('Speed (km/h)')
plt.title('Anomaly Detection: Speed vs Time')
plt.legend()

# Plot 2: Passenger count distribution
plt.subplot(1, 3, 2)
plt.hist([normal_points['passenger_count'], anomaly_points['passenger_count']],
        alpha=0.7, label=['Normal', 'Anomaly'], color=['blue', 'red'])
plt.xlabel('Passenger Count')
plt.ylabel('Frequency')
plt.title('Passenger Count Distribution')
plt.legend()

# Plot 3: Anomaly types
anomaly_reasons = []
for idx, row in anomaly_points.iterrows():
    if row['speed_kmh'] < 10:
        anomaly_reasons.append('Very Slow')
    elif row['passenger_count'] > 30:
        anomaly_reasons.append('Overcrowded')
    elif row['passenger_count'] < 5:
        anomaly_reasons.append('Empty Bus')
    elif row['time_between_stops_min'] > 8:
        anomaly_reasons.append('Long Delay')
    else:
        anomaly_reasons.append('Other')

reason_counts = pd.Series(anomaly_reasons).value_counts()
plt.subplot(1, 3, 3)
plt.pie(reason_counts.values, labels=reason_counts.index, autopct='%1.1f%%')
plt.title('Types of Detected Anomalies')

plt.tight_layout()
plt.savefig('anomaly_detection_results.png', dpi=300, bbox_inches='tight')
plt.show()

print(f"\n=== ANOMALY TYPES DETECTED ===")
for reason, count in reason_counts.items():
    print(f"{reason}: {count} buses")

# Save results
df.to_csv('anomaly_detection_results.csv', index=False)
print(f"\nResults saved to 'anomaly_detection_results.csv'")
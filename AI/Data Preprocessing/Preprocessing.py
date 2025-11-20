# =============================================================================
# TRANSCONNECT - DATA PREPROCESSING PIPELINE
# Computing Intelligence & Applications - Group Assignment #3
# UPDATED VERSION WITH REALISTIC TIMING SCENARIOS - FIXED VERSION
# =============================================================================

import pandas as pd
import numpy as np
from math import radians, sin, cos, sqrt, atan2
import matplotlib.pyplot as plt
import seaborn as sns

# =============================================================================
# 1. DATA LOADING AND INITIAL ASSESSMENT
# =============================================================================

def load_and_assess_data():
    """
    Load raw bus route data and perform initial assessment
    """
    # Load the route details CSV file
    df = pd.read_csv('Route Details - Kabuga - Nyabugogo.csv')
    
    # Initial data assessment
    print("=== DATA ASSESSMENT ===")
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    print("\nFirst 5 rows:")
    print(df.head())
    print("\nMissing values:")
    print(df.isnull().sum())
    print("\nData types:")
    print(df.dtypes)
    
    return df

# =============================================================================
# 2. DATA CLEANING
# =============================================================================

def clean_data(df):
    """
    Handle missing values, inconsistencies, and formatting issues
    """
    print("\n=== DATA CLEANING ===")
    
    # Create a copy of the dataframe
    df_clean = df.copy()
    
    # Clean coordinate formats - convert S/E to negative/positive
    df_clean['latitude'] = df_clean['Latitude'].str.replace('S', '-').astype(float)
    df_clean['longitude'] = df_clean['Longitude'].str.replace('E', '').astype(float)
    
    # Standardize stop names
    stop_name_mapping = {
        'Masaka': 'Masaka',
        'Kabuga': 'Kabuga',
        'Mulindri': 'Mulindi',
        'Kibaya_Minagri': 'Kibaya Minagri',
        'Brailrwa3': 'Bralirwa',
        'Sonatubes4': 'Sonatubes',
        'Rwandex3': 'Rwandex'
    }
    
    for old_name, new_name in stop_name_mapping.items():
        df_clean['Stops'] = df_clean['Stops'].str.replace(old_name, new_name, regex=False)
    
    # Handle missing values
    df_clean = df_clean.dropna(subset=['latitude', 'longitude', 'Stops'])
    
    # Remove duplicates based on stop name and coordinates
    df_clean = df_clean.drop_duplicates(subset=['Stops', 'latitude', 'longitude'])
    
    # Add stop sequence if not present
    df_clean['stop_sequence'] = range(1, len(df_clean) + 1)
    
    print(f"Original stops: {len(df)}")
    print(f"Cleaned stops: {len(df_clean)}")
    print(f"Sample cleaned data:")
    print(df_clean[['Stops', 'latitude', 'longitude']].head())
    
    return df_clean

# =============================================================================
# 3. DATA INTEGRATION
# =============================================================================

def integrate_datasets(df_clean):
    """
    Prepare data structure for route analysis
    """
    print("\n=== DATA INTEGRATION ===")
    
    # Create unique stop IDs
    df_clean['stop_id'] = range(1, len(df_clean) + 1)
    
    # Assign route information
    df_clean['route_id'] = 'Kabuga_Nyabugogo_001'
    df_clean['route_name'] = 'Kabuga - Nyabugogo'
    
    # Create route-stop sequence mapping
    route_stop_sequence = {
        'Kabuga_Nyabugogo_001': df_clean[['stop_id', 'stop_sequence', 'Stops']].sort_values('stop_sequence').to_dict('records')
    }
    
    print(f"Integrated dataset shape: {df_clean.shape}")
    print(f"Routes processed: {len(route_stop_sequence)}")
    print(f"Stops in route: {len(route_stop_sequence['Kabuga_Nyabugogo_001'])}")
    
    return df_clean, route_stop_sequence

# =============================================================================
# 4. DATA REDUCTION
# =============================================================================

def reduce_data(df_integrated):
    """
    Select relevant features and reduce dimensionality
    """
    print("\n=== DATA REDUCTION ===")
    
    # Select key features for modeling
    essential_features = [
        'route_id', 'route_name', 'stop_id', 'stop_sequence', 
        'latitude', 'longitude', 'Stops'
    ]
    
    df_reduced = df_integrated[essential_features].copy()
    
    # Rename columns for consistency
    df_reduced = df_reduced.rename(columns={'Stops': 'stop_name'})
    
    # Remove irrelevant columns that were in raw data
    columns_removed = set(df_integrated.columns) - set(essential_features)
    print(f"Columns removed: {columns_removed}")
    print(f"Reduced dataset shape: {df_reduced.shape}")
    print(f"Final features: {df_reduced.columns.tolist()}")
    
    return df_reduced

# =============================================================================
# 5. DATA TRANSFORMATION & FEATURE ENGINEERING
# =============================================================================

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate great-circle distance between two points in kilometers
    """
    R = 6371  # Earth radius in km
    
    # Convert degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    # Haversine formula
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c

def engineer_features(df_reduced, route_stop_sequence):
    """
    Create new features from raw coordinates and route data
    with realistic timing scenarios
    """
    print("\n=== FEATURE ENGINEERING ===")
    
    # Initialize new columns
    df_reduced['distance_to_next'] = 0.0
    df_reduced['cumulative_distance'] = 0.0
    df_reduced['estimated_travel_time_min'] = 0.0
    df_reduced['normal_day_time_min'] = 0.0  # Normal day: 45 km/h
    df_reduced['morning_traffic_time_min'] = 0.0  # Morning traffic: 35 km/h
    
    for route_id, stops in route_stop_sequence.items():
        route_df = df_reduced[df_reduced['route_id'] == route_id].sort_values('stop_sequence')
        
        print(f"Processing route: {route_id} with {len(route_df)} stops")
        
        for i in range(len(route_df)):
            current_idx = route_df.index[i]
            
            if i < len(route_df) - 1:  # Not the last stop
                next_stop = route_df.iloc[i + 1]
                current_stop = route_df.iloc[i]
                
                distance = haversine_distance(
                    current_stop['latitude'], current_stop['longitude'],
                    next_stop['latitude'], next_stop['longitude']
                )
                
                # Update distance to next stop
                df_reduced.loc[current_idx, 'distance_to_next'] = distance
                
                # Calculate travel times for different scenarios
                # Normal day: 45 km/h
                normal_time = (distance / 45) * 60  # Convert to minutes
                df_reduced.loc[current_idx, 'normal_day_time_min'] = normal_time
                
                # Morning traffic: 35 km/h  
                morning_time = (distance / 35) * 60  # Convert to minutes
                df_reduced.loc[current_idx, 'morning_traffic_time_min'] = morning_time
                
                # Keep original estimated time as normal day
                df_reduced.loc[current_idx, 'estimated_travel_time_min'] = normal_time
                
            else:  # Last stop
                df_reduced.loc[current_idx, 'distance_to_next'] = 0
                df_reduced.loc[current_idx, 'estimated_travel_time_min'] = 0
                df_reduced.loc[current_idx, 'normal_day_time_min'] = 0
                df_reduced.loc[current_idx, 'morning_traffic_time_min'] = 0
            
            # Update cumulative distance
            if i == 0:
                df_reduced.loc[current_idx, 'cumulative_distance'] = 0
            else:
                prev_stop = route_df.iloc[i-1]
                prev_cumulative = df_reduced.loc[prev_stop.name, 'cumulative_distance']
                prev_distance = df_reduced.loc[prev_stop.name, 'distance_to_next']
                df_reduced.loc[current_idx, 'cumulative_distance'] = prev_cumulative + prev_distance
    
    # Calculate total route statistics for both scenarios
    total_distance = df_reduced['distance_to_next'].sum()
    total_normal_time = df_reduced['normal_day_time_min'].sum()
    total_morning_time = df_reduced['morning_traffic_time_min'].sum()
    
    print("Feature engineering completed:")
    print(f"- Total route distance: {total_distance:.2f} km")
    print(f"- Normal day (45 km/h): {total_normal_time:.1f} minutes ({total_normal_time/60:.1f} hours)")
    print(f"- Morning traffic (35 km/h): {total_morning_time:.1f} minutes ({total_morning_time/60:.1f} hours)")
    print(f"- Time difference: +{(total_morning_time - total_normal_time):.1f} minutes")
    print(f"- Average speed impact: -10 km/h in morning traffic")
    
    return df_reduced

# =============================================================================
# 6. DATA DISCRETIZATION
# =============================================================================

def discretize_features(df_transformed):
    """
    Convert continuous variables into categorical bins
    """
    print("\n=== DATA DISCRETIZATION ===")
    
    # Discretize cumulative distance into route segments
    max_distance = df_transformed['cumulative_distance'].max()
    distance_bins = [0, max_distance*0.25, max_distance*0.5, max_distance*0.75, max_distance + 0.1]
    distance_labels = ['Start', 'Early', 'Mid', 'Late']
    
    df_transformed['route_segment'] = pd.cut(
        df_transformed['cumulative_distance'], 
        bins=distance_bins, 
        labels=distance_labels,
        include_lowest=True
    )
    
    # Discretize travel time estimates - handle NaN values
    time_bins = [0, 2, 5, 10, float('inf')]
    time_labels = ['Very Short', 'Short', 'Medium', 'Long']
    
    df_transformed['travel_time_category'] = pd.cut(
        df_transformed['estimated_travel_time_min'], 
        bins=time_bins, 
        labels=time_labels
    )
    
    # Fill NaN values in travel_time_category (for last stop)
    df_transformed['travel_time_category'] = df_transformed['travel_time_category'].fillna('Very Short')
    
    # Discretize distances between stops
    distance_bins_stops = [0, 0.5, 1.0, 2.0, float('inf')]
    distance_labels_stops = ['Very Close', 'Close', 'Medium', 'Far']
    
    df_transformed['distance_category'] = pd.cut(
        df_transformed['distance_to_next'], 
        bins=distance_bins_stops, 
        labels=distance_labels_stops
    )
    
    print("Discretization completed:")
    print("\nRoute segments distribution:")
    print(df_transformed['route_segment'].value_counts().sort_index())
    print("\nTravel time categories:")
    print(df_transformed['travel_time_category'].value_counts().sort_index())
    print("\nDistance categories:")
    print(df_transformed['distance_category'].value_counts().sort_index())
    
    return df_transformed

# =============================================================================
# 7. DATA AUGMENTATION
# =============================================================================

def augment_dataset(df_processed, route_stop_sequence):
    """
    Generate synthetic data for robust model training
    using realistic timing scenarios
    """
    print("\n=== DATA AUGMENTATION ===")
    
    # Add condition column to original data first
    df_processed = df_processed.copy()
    df_processed['condition'] = 'normal_day'  # Default to normal day
    augmented_data = [df_processed]  # Start with original data
    
    for route_id in route_stop_sequence.keys():
        route_data = df_processed[df_processed['route_id'] == route_id]
        
        # Generate variations for different conditions based on realistic scenarios
        conditions = {
            'morning_traffic': {
                'time_factor': 1.286,  # 45km/h vs 35km/h = 28.6% longer (45/35 = 1.286)
                'description': 'Morning rush hour (35 km/h)'
            },
            'evening_traffic': {
                'time_factor': 1.286,  # Same as morning traffic
                'description': 'Evening rush hour (35 km/h)'
            },
            'weekend': {
                'time_factor': 0.9,    # 10% faster than normal
                'description': 'Weekend lighter traffic'
            },
            'rainy_day': {
                'time_factor': 1.2,    # 20% longer due to rain
                'description': 'Rainy day conditions'
            },
            'late_night': {
                'time_factor': 0.8,    # 20% faster late at night
                'description': 'Late night empty roads'
            }
        }
        
        for condition, params in conditions.items():
            condition_data = route_data.copy()
            time_factor = params['time_factor']
            
            # Modify travel times based on condition
            condition_data['estimated_travel_time_min'] = condition_data['normal_day_time_min'] * time_factor
            
            # Add some noise to distances (simulating different routing)
            np.random.seed(42)  # For reproducible results
            noise = np.random.normal(0, 0.03, len(condition_data))  # 3% noise
            condition_data['distance_to_next'] = condition_data['distance_to_next'] * (1 + noise)
            condition_data['distance_to_next'] = condition_data['distance_to_next'].clip(lower=0.01)
            
            # Recalculate cumulative distance for the new distances
            condition_data['cumulative_distance'] = 0.0
            for i in range(len(condition_data)):
                if i > 0:
                    prev_cumulative = condition_data.iloc[i-1]['cumulative_distance']
                    prev_distance = condition_data.iloc[i-1]['distance_to_next']
                    condition_data.iloc[i, condition_data.columns.get_loc('cumulative_distance')] = prev_cumulative + prev_distance
            
            condition_data['condition'] = condition
            augmented_data.append(condition_data)
    
    df_augmented = pd.concat(augmented_data, ignore_index=True)
    
    # Reapply discretization to augmented data
    df_augmented = discretize_features(df_augmented)
    
    print(f"Original data: {len(df_processed)} rows")
    print(f"Augmented data: {len(df_augmented)} rows")
    print(f"Augmentation factor: {len(df_augmented)/len(df_processed):.1f}x")
    print(f"Conditions generated: {df_augmented['condition'].unique()}")
    
    # Print realistic timing summary
    normal_total = df_processed['normal_day_time_min'].sum()
    morning_total = df_processed['morning_traffic_time_min'].sum()
    print(f"\nRealistic Timing Scenarios:")
    print(f"Normal day (45 km/h): {normal_total:.1f} min ({normal_total/60:.1f} hours)")
    print(f"Morning traffic (35 km/h): {morning_total:.1f} min ({morning_total/60:.1f} hours)")
    print(f"Delay during traffic: +{(morning_total - normal_total):.1f} minutes")
    
    return df_augmented

# =============================================================================
# 8. VISUALIZATION - FIXED VERSION
# =============================================================================

def visualize_results(df_final):
    """
    Create visualizations to demonstrate preprocessing impact
    with realistic timing scenarios - FIXED VERSION
    """
    print("\n=== DATA VISUALIZATION ===")
    
    # Set up plotting style
    plt.style.use('default')
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    
    # Filter data for different conditions - ensure we have the same number of stops
    normal_data = df_final[df_final['condition'] == 'normal_day']
    morning_data = df_final[df_final['condition'] == 'morning_traffic']
    
    # Sort and ensure same length for comparison plots
    normal_sorted = normal_data.sort_values('stop_sequence').reset_index(drop=True)
    morning_sorted = morning_data.sort_values('stop_sequence').reset_index(drop=True)
    
    # Ensure both datasets have the same number of stops for comparison
    min_length = min(len(normal_sorted), len(morning_sorted))
    normal_sorted = normal_sorted.head(min_length)
    morning_sorted = morning_sorted.head(min_length)
    
    # 1. Route segments distribution
    normal_data['route_segment'].value_counts().sort_index().plot(
        kind='bar', ax=axes[0,0], color='skyblue', edgecolor='black'
    )
    axes[0,0].set_title('Distribution of Stops by Route Segment\n(Normal Day)')
    axes[0,0].set_ylabel('Number of Stops')
    axes[0,0].tick_params(axis='x', rotation=45)
    
    # 2. Distance between stops histogram
    normal_data['distance_to_next'].hist(
        bins=15, ax=axes[0,1], color='lightgreen', edgecolor='black', alpha=0.7
    )
    axes[0,1].set_title('Distribution of Distances Between Stops\n(Normal Day)')
    axes[0,1].set_xlabel('Distance (km)')
    axes[0,1].set_ylabel('Frequency')
    
    # 3. Travel time comparison: Normal vs Other Conditions
    conditions_comparison = ['normal_day', 'morning_traffic', 'weekend', 'rainy_day']
    avg_times = []
    labels = []
    
    for condition in conditions_comparison:
        condition_data = df_final[df_final['condition'] == condition]
        if len(condition_data) > 0:
            avg_time = condition_data['estimated_travel_time_min'].mean()
            if not pd.isna(avg_time):
                avg_times.append(avg_time)
                labels.append(condition.replace('_', ' ').title())
    
    if avg_times:  # Only plot if we have data
        axes[0,2].bar(labels, avg_times, color=['blue', 'red', 'green', 'gray'])
        axes[0,2].set_title('Average Travel Time Between Stops\nby Condition')
        axes[0,2].set_ylabel('Travel Time (minutes)')
        axes[0,2].tick_params(axis='x', rotation=45)
    else:
        axes[0,2].text(0.5, 0.5, 'No data available\nfor travel time comparison', 
                      ha='center', va='center', transform=axes[0,2].transAxes)
        axes[0,2].set_title('Average Travel Time Between Stops\nby Condition')
    
    # 4. Cumulative travel time progression - FIXED: Ensure same dimensions
    if len(normal_sorted) == len(morning_sorted):
        axes[1,0].plot(normal_sorted['stop_sequence'], 
                       normal_sorted['estimated_travel_time_min'].cumsum(), 
                       marker='o', linewidth=2, markersize=4, color='blue', 
                       label='Normal Day (45 km/h)')
        axes[1,0].plot(morning_sorted['stop_sequence'], 
                       morning_sorted['estimated_travel_time_min'].cumsum(), 
                       marker='s', linewidth=2, markersize=4, color='red', 
                       label='Morning Traffic (35 km/h)')
        axes[1,0].set_title('Cumulative Travel Time Comparison')
        axes[1,0].set_xlabel('Stop Sequence')
        axes[1,0].set_ylabel('Cumulative Travel Time (minutes)')
        axes[1,0].grid(True, alpha=0.3)
        axes[1,0].legend()
    else:
        axes[1,0].text(0.5, 0.5, 'Data dimension mismatch\nfor time comparison', 
                      ha='center', va='center', transform=axes[1,0].transAxes)
        axes[1,0].set_title('Cumulative Travel Time Comparison')
    
    # 5. Speed comparison by condition
    speed_conditions = {
        'Normal Day': 45,
        'Morning Traffic': 35,
        'Weekend': 50,
        'Rainy Day': 40,
        'Late Night': 55
    }
    
    speeds = list(speed_conditions.keys())
    speed_values = list(speed_conditions.values())
    
    axes[1,1].barh(speeds, speed_values, color=['blue', 'red', 'green', 'gray', 'orange'])
    axes[1,1].set_title('Average Speed by Condition')
    axes[1,1].set_xlabel('Speed (km/h)')
    axes[1,1].set_xlim(0, 60)
    
    # 6. Time difference impact - FIXED: Ensure same dimensions
    if len(normal_sorted) == len(morning_sorted):
        time_difference = morning_sorted['estimated_travel_time_min'].cumsum() - normal_sorted['estimated_travel_time_min'].cumsum()
        axes[1,2].plot(normal_sorted['stop_sequence'], time_difference, 
                       linewidth=2, color='purple', marker='o', markersize=3)
        axes[1,2].set_title('Cumulative Time Delay\n(Morning Traffic vs Normal)')
        axes[1,2].set_xlabel('Stop Sequence')
        axes[1,2].set_ylabel('Time Delay (minutes)')
        axes[1,2].grid(True, alpha=0.3)
        axes[1,2].axhline(y=0, color='black', linestyle='--', alpha=0.5)
        
        # Add annotation for total delay
        if len(time_difference) > 0:
            total_delay = time_difference.iloc[-1] if hasattr(time_difference, 'iloc') else time_difference[-1]
            axes[1,2].annotate(f'Total Delay: {total_delay:.1f} min', 
                              xy=(len(time_difference)//2, total_delay/2),
                              xytext=(len(time_difference)//3, total_delay),
                              arrowprops=dict(arrowstyle='->', color='red'),
                              bbox=dict(boxstyle="round,pad=0.3", fc="yellow", alpha=0.7))
    else:
        axes[1,2].text(0.5, 0.5, 'Data dimension mismatch\nfor delay calculation', 
                      ha='center', va='center', transform=axes[1,2].transAxes)
        axes[1,2].set_title('Cumulative Time Delay\n(Morning Traffic vs Normal)')
    
    plt.tight_layout()
    plt.savefig('transconnect_preprocessing_visualizations.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Additional: Route map visualization with timing information
    plt.figure(figsize=(14, 10))
    
    # Use only normal data for route mapping
    route_data = normal_data.sort_values('stop_sequence').reset_index(drop=True)
    
    # Plot the route
    plt.plot(route_data['longitude'], route_data['latitude'], 
             marker='o', linewidth=2, markersize=6, color='blue', alpha=0.7,
             label='Bus Route')
    
    # Annotate some key stops with timing information
    important_stops = [0, len(route_data)//4, len(route_data)//2, 
                      3*len(route_data)//4, len(route_data)-1]
    
    for idx in important_stops:
        if idx < len(route_data):
            row = route_data.iloc[idx]
            normal_time = route_data['normal_day_time_min'].cumsum().iloc[idx]
            morning_time = route_data['morning_traffic_time_min'].cumsum().iloc[idx]
            
            plt.annotate(f"{row['stop_name']}\nNormal: {normal_time:.0f}min\nTraffic: {morning_time:.0f}min", 
                        (row['longitude'], row['latitude']),
                        xytext=(10, 10), textcoords='offset points',
                        fontsize=8, alpha=0.9,
                        bbox=dict(boxstyle="round,pad=0.3", fc="white", alpha=0.8),
                        arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=0"))
    
    plt.title('Kabuga - Nyabugogo Bus Route\nTransConnect Project - Timing Analysis', fontsize=14)
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.savefig('transconnect_route_map_with_timing.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Create a detailed timing comparison table
    print("\n=== DETAILED TIMING COMPARISON ===")
    comparison_data = []
    for condition in df_final['condition'].unique():
        condition_data = df_final[df_final['condition'] == condition]
        if len(condition_data) > 0:
            total_time = condition_data['estimated_travel_time_min'].sum()
            total_distance = condition_data['cumulative_distance'].max()
            if total_time > 0:
                avg_speed = total_distance / (total_time / 60)
            else:
                avg_speed = 0
            comparison_data.append({
                'Condition': condition.replace('_', ' ').title(),
                'Total Time (min)': round(total_time, 1),
                'Total Time (hours)': round(total_time / 60, 1),
                'Avg Speed (km/h)': round(avg_speed, 1),
                'Stops': len(condition_data)
            })
    
    if comparison_data:
        comparison_df = pd.DataFrame(comparison_data)
        print(comparison_df.to_string(index=False))
    else:
        print("No comparison data available")

# =============================================================================
# 9. MAIN EXECUTION PIPELINE
# =============================================================================

def main():
    """
    Main execution function for the data preprocessing pipeline
    """
    print("TRANSCONNECT DATA PREPROCESSING PIPELINE")
    print("WITH REALISTIC TIMING SCENARIOS - FIXED VERSION")
    print("=" * 60)
    
    try:
        # Step 1: Load and assess data
        df_raw = load_and_assess_data()
        
        # Step 2: Data cleaning
        df_clean = clean_data(df_raw)
        
        # Step 3: Data integration
        df_integrated, route_stop_sequence = integrate_datasets(df_clean)
        
        # Step 4: Data reduction
        df_reduced = reduce_data(df_integrated)
        
        # Step 5: Data transformation and feature engineering
        df_transformed = engineer_features(df_reduced, route_stop_sequence)
        
        # Step 6: Data discretization
        df_discretized = discretize_features(df_transformed)
        
        # Step 7: Data augmentation
        df_final = augment_dataset(df_discretized, route_stop_sequence)
        
        # Step 8: Visualization
        visualize_results(df_final)
        
        # Step 9: Save processed data
        df_final.to_csv('transconnect_processed_data.csv', index=False)
        normal_data = df_final[df_final['condition'] == 'normal_day']
        normal_data.to_csv('transconnect_clean_route.csv', index=False)
        
        # Save a summary report
        with open('preprocessing_summary.txt', 'w') as f:
            f.write("TRANSCONNECT DATA PREPROCESSING SUMMARY\n")
            f.write("WITH REALISTIC TIMING SCENARIOS - FIXED VERSION\n")
            f.write("=" * 60 + "\n")
            f.write(f"Original stops: {len(df_raw)}\n")
            f.write(f"Cleaned stops: {len(normal_data)}\n")
            f.write(f"Total route distance: {normal_data['cumulative_distance'].max():.2f} km\n")
            f.write(f"Normal day travel time: {normal_data['normal_day_time_min'].sum():.1f} minutes\n")
            f.write(f"Morning traffic time: {normal_data['morning_traffic_time_min'].sum():.1f} minutes\n")
            f.write(f"Time delay in traffic: +{(normal_data['morning_traffic_time_min'].sum() - normal_data['normal_day_time_min'].sum()):.1f} minutes\n")
            f.write(f"Augmented dataset size: {len(df_final)} rows\n")
            f.write(f"Conditions simulated: {len(df_final['condition'].unique())}\n")
            f.write(f"Average speed - Normal: 45 km/h\n")
            f.write(f"Average speed - Traffic: 35 km/h\n")
        
        print(f"\n=== PROCESSING COMPLETE ===")
        print(f"Final dataset saved: {len(df_final)} rows, {len(df_final.columns)} columns")
        print(f"Files created:")
        print(f"- transconnect_processed_data.csv (all conditions)")
        print(f"- transconnect_clean_route.csv (normal condition only)")
        print(f"- transconnect_preprocessing_visualizations.png")
        print(f"- transconnect_route_map_with_timing.png")
        print(f"- preprocessing_summary.txt")
        
        return df_final
        
    except Exception as e:
        print(f"Error in preprocessing pipeline: {e}")
        import traceback
        traceback.print_exc()
        return None

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    processed_data = main()
    
    # Display final dataset info
    if processed_data is not None:
        print("\nFinal Dataset Summary:")
        print(processed_data.info())
        print("\nFirst 5 rows of normal condition:")
        normal_data = processed_data[processed_data['condition'] == 'normal_day']
        print(normal_data[['stop_name', 'latitude', 'longitude', 'normal_day_time_min', 'morning_traffic_time_min']].head())
        
        print("\nKey Statistics:")
        print(f"Total stops in route: {len(normal_data)}")
        print(f"Total route distance: {normal_data['cumulative_distance'].max():.2f} km")
        print(f"Normal day travel time: {normal_data['normal_day_time_min'].sum():.1f} minutes ({normal_data['normal_day_time_min'].sum()/60:.1f} hours)")
        print(f"Morning traffic time: {normal_data['morning_traffic_time_min'].sum():.1f} minutes ({normal_data['morning_traffic_time_min'].sum()/60:.1f} hours)")
        print(f"Time delay in traffic: +{(normal_data['morning_traffic_time_min'].sum() - normal_data['normal_day_time_min'].sum()):.1f} minutes")
        print(f"Normal day average speed: {normal_data['cumulative_distance'].max() / (normal_data['normal_day_time_min'].sum() / 60):.1f} km/h")
        print(f"Morning traffic average speed: {normal_data['cumulative_distance'].max() / (normal_data['morning_traffic_time_min'].sum() / 60):.1f} km/h")
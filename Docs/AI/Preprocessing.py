# =============================================================================
# TRANSCONNECT - DATA PREPROCESSING PIPELINE
# Computing Intelligence & Applications - Group Assignment #3
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
    """
    print("\n=== FEATURE ENGINEERING ===")
    
    # Initialize new columns
    df_reduced['distance_to_next'] = 0.0
    df_reduced['cumulative_distance'] = 0.0
    df_reduced['estimated_travel_time_min'] = 0.0
    
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
                
                # Estimate travel time (assuming average speed 25 km/h in urban areas)
                travel_time = (distance / 25) * 60  # Convert to minutes
                df_reduced.loc[current_idx, 'estimated_travel_time_min'] = travel_time
            else:  # Last stop
                df_reduced.loc[current_idx, 'distance_to_next'] = 0
                df_reduced.loc[current_idx, 'estimated_travel_time_min'] = 0
            
            # Update cumulative distance
            if i == 0:
                df_reduced.loc[current_idx, 'cumulative_distance'] = 0
            else:
                prev_stop = route_df.iloc[i-1]
                prev_cumulative = df_reduced.loc[prev_stop.name, 'cumulative_distance']
                prev_distance = df_reduced.loc[prev_stop.name, 'distance_to_next']
                df_reduced.loc[current_idx, 'cumulative_distance'] = prev_cumulative + prev_distance
    
    # Calculate total route statistics
    total_distance = df_reduced['distance_to_next'].sum()
    total_time = df_reduced['estimated_travel_time_min'].sum()
    
    print("Feature engineering completed:")
    print(f"- Total route distance: {total_distance:.2f} km")
    print(f"- Total estimated time: {total_time:.1f} minutes")
    print(f"- Average distance between stops: {df_reduced['distance_to_next'].mean():.2f} km")
    print(f"- Average time between stops: {df_reduced['estimated_travel_time_min'].mean():.1f} min")
    
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
    """
    print("\n=== DATA AUGMENTATION ===")
    
    # Add condition column to original data first
    df_processed = df_processed.copy()
    df_processed['condition'] = 'normal'
    augmented_data = [df_processed]  # Start with original data
    
    for route_id in route_stop_sequence.keys():
        route_data = df_processed[df_processed['route_id'] == route_id]
        
        # Generate variations for different conditions
        conditions = {
            'rush_hour': 1.6,  # 60% longer travel times
            'weekend': 0.8,    # 20% shorter travel times  
            'rainy': 1.4,      # 40% longer travel times
            'late_night': 0.7, # 30% shorter travel times
            'accident': 2.0    # 100% longer travel times
        }
        
        for condition, time_factor in conditions.items():
            condition_data = route_data.copy()
            
            # Modify travel times based on condition
            condition_data['estimated_travel_time_min'] = condition_data['estimated_travel_time_min'] * time_factor
            
            # Add some noise to distances (simulating different routing)
            np.random.seed(42)  # For reproducible results
            noise = np.random.normal(0, 0.05, len(condition_data))  # 5% noise
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
    
    return df_augmented

# =============================================================================
# 8. VISUALIZATION
# =============================================================================

def visualize_results(df_final):
    """
    Create visualizations to demonstrate preprocessing impact
    """
    print("\n=== DATA VISUALIZATION ===")
    
    # Set up plotting style
    plt.style.use('default')
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    
    # Filter only normal condition for some plots
    normal_data = df_final[df_final['condition'] == 'normal']
    
    # 1. Route segments distribution
    normal_data['route_segment'].value_counts().sort_index().plot(
        kind='bar', ax=axes[0,0], color='skyblue', edgecolor='black'
    )
    axes[0,0].set_title('Distribution of Stops by Route Segment\n(Normal Conditions)')
    axes[0,0].set_ylabel('Number of Stops')
    axes[0,0].tick_params(axis='x', rotation=45)
    
    # 2. Distance between stops histogram
    normal_data['distance_to_next'].hist(
        bins=15, ax=axes[0,1], color='lightgreen', edgecolor='black', alpha=0.7
    )
    axes[0,1].set_title('Distribution of Distances Between Stops\n(Normal Conditions)')
    axes[0,1].set_xlabel('Distance (km)')
    axes[0,1].set_ylabel('Frequency')
    
    # 3. Travel time by condition
    travel_times = df_final.groupby('condition')['estimated_travel_time_min'].mean().sort_values()
    # Filter out any NaN values
    travel_times = travel_times[travel_times.notna()]
    travel_times.plot(
        kind='barh', ax=axes[0,2], color='orange', edgecolor='black'
    )
    axes[0,2].set_title('Average Travel Time by Condition')
    axes[0,2].set_xlabel('Travel Time (minutes)')
    
    # 4. Cumulative distance progression
    normal_data_sorted = normal_data.sort_values('stop_sequence')
    axes[1,0].plot(normal_data_sorted['stop_sequence'], normal_data_sorted['cumulative_distance'], 
                   marker='o', linewidth=2, markersize=4, color='red')
    axes[1,0].set_title('Cumulative Distance Along Route')
    axes[1,0].set_xlabel('Stop Sequence')
    axes[1,0].set_ylabel('Cumulative Distance (km)')
    axes[1,0].grid(True, alpha=0.3)
    
    # 5. Travel time categories - handle potential NaN values
    travel_time_counts = normal_data['travel_time_category'].value_counts()
    if not travel_time_counts.empty:
        travel_time_counts.sort_index().plot(
            kind='pie', ax=axes[1,1], autopct='%1.1f%%', 
            colors=['lightblue', 'lightgreen', 'yellow', 'orange']
        )
        axes[1,1].set_title('Travel Time Categories Distribution\n(Normal Conditions)')
    else:
        axes[1,1].text(0.5, 0.5, 'No data available\nfor travel time categories', 
                      ha='center', va='center', transform=axes[1,1].transAxes)
        axes[1,1].set_title('Travel Time Categories Distribution\n(Normal Conditions)')
    
    # 6. Distance categories
    normal_data['distance_category'].value_counts().sort_index().plot(
        kind='bar', ax=axes[1,2], color='purple', alpha=0.7, edgecolor='black'
    )
    axes[1,2].set_title('Distance Categories Between Stops')
    axes[1,2].set_ylabel('Number of Stops')
    axes[1,2].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('transconnect_preprocessing_visualizations.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Additional: Route map visualization
    plt.figure(figsize=(12, 8))
    
    # Plot the route
    plt.plot(normal_data_sorted['longitude'], normal_data_sorted['latitude'], 
             marker='o', linewidth=2, markersize=6, color='blue', alpha=0.7,
             label='Bus Route')
    
    # Annotate some key stops
    important_stops = [0, 5, 10, 15, 20, 25, 30, 35]  # Key stops to label
    for idx in important_stops:
        if idx < len(normal_data_sorted):
            row = normal_data_sorted.iloc[idx]
            plt.annotate(row['stop_name'], 
                        (row['longitude'], row['latitude']),
                        xytext=(5, 5), textcoords='offset points',
                        fontsize=8, alpha=0.8,
                        bbox=dict(boxstyle="round,pad=0.3", fc="white", alpha=0.7))
    
    plt.title('Kabuga - Nyabugogo Bus Route\nTransConnect Project')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.savefig('transconnect_route_map.png', dpi=300, bbox_inches='tight')
    plt.show()

# =============================================================================
# 9. MAIN EXECUTION PIPELINE
# =============================================================================

def main():
    """
    Main execution function for the data preprocessing pipeline
    """
    print("TRANSCONNECT DATA PREPROCESSING PIPELINE")
    print("=" * 50)
    
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
        normal_data = df_final[df_final['condition'] == 'normal']
        normal_data.to_csv('transconnect_clean_route.csv', index=False)
        
        # Save a summary report
        with open('preprocessing_summary.txt', 'w') as f:
            f.write("TRANSCONNECT DATA PREPROCESSING SUMMARY\n")
            f.write("=" * 50 + "\n")
            f.write(f"Original stops: {len(df_raw)}\n")
            f.write(f"Cleaned stops: {len(normal_data)}\n")
            f.write(f"Total route distance: {normal_data['cumulative_distance'].max():.2f} km\n")
            f.write(f"Total travel time: {normal_data['estimated_travel_time_min'].sum():.1f} minutes\n")
            f.write(f"Augmented dataset size: {len(df_final)} rows\n")
            f.write(f"Conditions simulated: {len(df_final['condition'].unique())}\n")
        
        print(f"\n=== PROCESSING COMPLETE ===")
        print(f"Final dataset saved: {len(df_final)} rows, {len(df_final.columns)} columns")
        print(f"Files created:")
        print(f"- transconnect_processed_data.csv (all conditions)")
        print(f"- transconnect_clean_route.csv (normal condition only)")
        print(f"- transconnect_preprocessing_visualizations.png")
        print(f"- transconnect_route_map.png")
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
        normal_data = processed_data[processed_data['condition'] == 'normal']
        print(normal_data.head())
        
        print("\nKey Statistics:")
        print(f"Total stops in route: {len(normal_data)}")
        print(f"Total route distance: {normal_data['cumulative_distance'].max():.2f} km")
        print(f"Total travel time: {normal_data['estimated_travel_time_min'].sum():.1f} minutes")
        print(f"Average speed: {normal_data['cumulative_distance'].max() / (normal_data['estimated_travel_time_min'].sum() / 60):.1f} km/h")
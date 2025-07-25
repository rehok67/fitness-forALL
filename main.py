import numpy as np
import pandas as pd
import re
import os

# Get the current directory where the script is located
current_dir = os.path.dirname(os.path.abspath(__file__))
def fix_list_columns(df):
    """
    convert string representations to actual lists
    """
    def convert_string_to_list(val):
        if pd.isna(val):
            return []
        elif isinstance(val, list):
            return val
        elif isinstance(val, str):
            # Remove brackets and quotes, then split
            cleaned = re.sub(r'[\[\]"\']', '', val)
            items = [item.strip() for item in cleaned.split(',')]
            return [item for item in items if item and item != '']
        else:
            return []

    # Apply to both columns
    df['level'] = df['level'].apply(convert_string_to_list)
    df['goal'] = df['goal'].apply(convert_string_to_list)

    print("Fixed level and goal columns")
    return df

# Read the input CSV file
input_file = 'program_summary.csv'
input_path = os.path.join(current_dir, input_file)
df = pd.read_csv(input_path, low_memory=False)

# Fix the list columns
df = fix_list_columns(df)

# Save the processed file
output_file = 'program_summary_processed.csv'
output_path = os.path.join(current_dir, output_file)
df.to_csv(output_path, index=False)

print(f"Processed data saved to: {output_file}")
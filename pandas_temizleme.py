import pandas as pd
import os

# Get the current directory where the script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Read the CSV file
input_file = 'program_summary_processed.csv'
input_path = os.path.join(current_dir, input_file)

# Read the CSV into a pandas DataFrame
df = pd.read_csv(input_path)

# Display basic information about the DataFrame
print("\nDataFrame Info:")
print("="*50)
df.info()

# Display the first few rows of the DataFrame
print("\nFirst Few Rows of the Data:")
print("="*50)
print(df.head())

# Display basic statistics of numerical columns
print("\nBasic Statistics of Numerical Columns:")
print("="*50)
print(df.describe())

# Display the shape of the DataFrame
print("\nDataFrame Shape (Rows, Columns):")
print("="*50)
print(f"Total Rows: {df.shape[0]}")
print(f"Total Columns: {df.shape[1]}")

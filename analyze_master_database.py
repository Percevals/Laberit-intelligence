#!/usr/bin/env python3
"""
Analyze MasterDatabaseV3.1.xlsx for data migration planning
"""

import pandas as pd
import numpy as np
from pathlib import Path

def analyze_excel_file(file_path):
    """Comprehensive analysis of the Excel file"""
    
    print(f"Analyzing file: {file_path}")
    print("=" * 80)
    
    # Read all sheets
    excel_file = pd.ExcelFile(file_path)
    
    # 1. List all sheet names
    print("\n1. SHEET NAMES IN WORKBOOK:")
    print("-" * 40)
    for i, sheet in enumerate(excel_file.sheet_names, 1):
        print(f"{i}. {sheet}")
    
    # 2. Analyze Dim_Clients sheet
    if 'Dim_Clients' in excel_file.sheet_names:
        print("\n\n2. ANALYSIS OF 'Dim_Clients' SHEET:")
        print("=" * 80)
        
        df = pd.read_excel(file_path, sheet_name='Dim_Clients')
        
        # Column headers and data types
        print("\nCOLUMN HEADERS AND DATA TYPES:")
        print("-" * 40)
        for col in df.columns:
            dtype = df[col].dtype
            non_null = df[col].notna().sum()
            null_count = df[col].isna().sum()
            print(f"{col:<30} | Type: {str(dtype):<15} | Non-null: {non_null:<6} | Null: {null_count}")
        
        # First 5 rows
        print("\n\nFIRST 5 COMPLETE ROWS:")
        print("-" * 40)
        print(df.head().to_string())
        
        # Total records
        print(f"\n\nTOTAL NUMBER OF RECORDS: {len(df)}")
        
        # 3. Identify core metrics columns
        print("\n\n3. CORE METRICS COLUMNS:")
        print("-" * 40)
        metric_keywords = ['score', 'readiness', 'performance', 'index', 'rating', 'metric', 'kpi', 'level']
        metric_columns = []
        
        for col in df.columns:
            if any(keyword in col.lower() for keyword in metric_keywords):
                metric_columns.append(col)
        
        if metric_columns:
            for col in metric_columns:
                print(f"- {col}")
        else:
            print("No obvious metric columns found based on naming convention.")
        
        # 4. Comprehensive summary
        print("\n\n4. COMPREHENSIVE SUMMARY:")
        print("=" * 80)
        
        # Numerical columns analysis
        print("\nNUMERICAL COLUMNS - RANGE OF VALUES:")
        print("-" * 40)
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            if len(df[col].dropna()) > 0:
                print(f"\n{col}:")
                print(f"  Min: {df[col].min():.2f}")
                print(f"  Max: {df[col].max():.2f}")
                print(f"  Mean: {df[col].mean():.2f}")
                print(f"  Median: {df[col].median():.2f}")
                print(f"  Std Dev: {df[col].std():.2f}")
                print(f"  Non-null count: {df[col].notna().sum()}")
        
        # Categorical columns analysis
        print("\n\nCATEGORICAL COLUMNS - UNIQUE VALUES:")
        print("-" * 40)
        
        # Look for specific columns
        categorical_of_interest = ['BUSINESS_MODEL', 'SECTOR', 'COUNTRY', 'INDUSTRY', 'REGION', 'SIZE']
        
        for col in df.columns:
            # Check if column name matches our interest or is non-numeric
            if col in categorical_of_interest or (df[col].dtype == 'object' and col.upper() in categorical_of_interest):
                print(f"\n{col}:")
                unique_vals = df[col].dropna().unique()
                print(f"  Unique values ({len(unique_vals)}): {', '.join(map(str, unique_vals[:10]))}")
                if len(unique_vals) > 10:
                    print(f"  ... and {len(unique_vals) - 10} more")
                
                # Value counts for important columns
                if col.upper() in ['BUSINESS_MODEL', 'SECTOR', 'COUNTRY']:
                    print(f"\n  Value counts for {col}:")
                    value_counts = df[col].value_counts()
                    for val, count in value_counts.head(10).items():
                        print(f"    {val}: {count}")
        
        # Missing values analysis
        print("\n\nMISSING VALUES ANALYSIS:")
        print("-" * 40)
        missing_summary = df.isnull().sum()
        missing_summary = missing_summary[missing_summary > 0].sort_values(ascending=False)
        
        if len(missing_summary) > 0:
            print("Columns with missing values:")
            for col, count in missing_summary.items():
                percentage = (count / len(df)) * 100
                print(f"  {col}: {count} missing ({percentage:.1f}%)")
        else:
            print("No missing values found!")
        
        # Additional analysis for framework mapping
        print("\n\nADDITIONAL INSIGHTS FOR MIGRATION:")
        print("-" * 40)
        
        # Check for date columns
        date_cols = df.select_dtypes(include=['datetime64']).columns
        if len(date_cols) > 0:
            print(f"\nDate columns found: {', '.join(date_cols)}")
            for col in date_cols:
                print(f"  {col} range: {df[col].min()} to {df[col].max()}")
        
        # Check for ID columns
        id_cols = [col for col in df.columns if 'id' in col.lower() or col.lower().endswith('_id')]
        if id_cols:
            print(f"\nPotential ID columns: {', '.join(id_cols)}")
        
    else:
        print("\n'Dim_Clients' sheet not found in the workbook!")
        print("Available sheets:", excel_file.sheet_names)

# Main execution
if __name__ == "__main__":
    file_path = Path("data/MasterDatabaseV3.1.xlsx")
    
    if file_path.exists():
        analyze_excel_file(file_path)
    else:
        print(f"Error: File not found at {file_path}")
        print("Please ensure the file exists in the data directory.")
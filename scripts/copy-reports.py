#!/usr/bin/env python3
"""
Script to copy HTML report files from StockStrategiest/results/ to static/reports/
This script only performs file copying operations without reading file content.
"""

import os
import shutil
import glob
from pathlib import Path

def copy_reports():
    """Copy all HTML files from StockStrategiest/results/ to static/reports/"""
    
    # Define source and destination directories
    source_dir = Path("StockStrategiest/results")
    dest_dir = Path("static/reports")
    
    try:
        # Check if source directory exists
        if not source_dir.exists():
            print(f"Error: Source directory '{source_dir}' does not exist")
            return False
        
        # Create destination directory if it doesn't exist
        dest_dir.mkdir(parents=True, exist_ok=True)
        print(f"Destination directory '{dest_dir}' ready")
        
        # Find all HTML files in source directory
        html_files = list(source_dir.glob("*.html"))
        
        if not html_files:
            print(f"No HTML files found in '{source_dir}'")
            return True
        
        # Copy each HTML file
        copied_count = 0
        for html_file in html_files:
            try:
                dest_file = dest_dir / html_file.name
                shutil.copy2(html_file, dest_file)
                print(f"Copied: {html_file.name}")
                copied_count += 1
            except Exception as e:
                print(f"Error copying {html_file.name}: {e}")
        
        print(f"Successfully copied {copied_count} HTML files")
        return True
        
    except Exception as e:
        print(f"Error during copy operation: {e}")
        return False

def verify_copied_files():
    """Verify that HTML files exist in the destination directory"""
    dest_dir = Path("static/reports")
    
    if not dest_dir.exists():
        print("Destination directory does not exist")
        return False
    
    html_files = list(dest_dir.glob("*.html"))
    print(f"Found {len(html_files)} HTML files in destination:")
    for html_file in html_files:
        print(f"  - {html_file.name}")
    
    return len(html_files) > 0

if __name__ == "__main__":
    print("Starting HTML report copy process...")
    
    if copy_reports():
        print("\nVerifying copied files...")
        verify_copied_files()
        print("\nCopy process completed successfully!")
    else:
        print("\nCopy process failed!")
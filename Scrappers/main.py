#!/usr/bin/env python3
"""
Main scraper runner for FYP Scrappers project
Supports both Graana and Zameen scrapers
"""

import os
import sys
import time
import argparse
from datetime import datetime

# Add the current directory to Python path to import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_graana_scrapers():
    """Run all Graana scrapers"""
    print("=" * 60)
    print("STARTING GRANA SCRAPERS")
    print("=" * 60)
    
    graana_scrapers = [
        ("Graana House Sales", "Graana/graana_house_sale.py"),
        ("Graana House Rentals", "Graana/graana_house_rent.py"),
        ("Graana Plot Sales", "Graana/graana_plot_sale.py"),
        ("Graana Commercial Sales", "Graana/graana_commercial_sale.py"),
        ("Graana Commercial Rentals", "Graana/graana_commercial_rent.py")
    ]
    
    results = {}
    
    for name, script_path in graana_scrapers:
        if os.path.exists(script_path):
            print(f"\n🔄 Running {name}...")
            start_time = time.time()
            
            try:
                # Import and run the scraper
                module_name = script_path.replace('/', '.').replace('.py', '')
                exec(f"import {module_name}")
                exec(f"{module_name}.main()")
                
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "SUCCESS", "duration": duration}
                print(f"✅ {name} completed successfully in {duration:.2f} seconds")
                
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "FAILED", "duration": duration, "error": str(e)}
                print(f"❌ {name} failed: {str(e)}")
        else:
            print(f"⚠️  {name} script not found: {script_path}")
            results[name] = {"status": "NOT_FOUND", "duration": 0}
    
    return results

def run_zameen_scrapers():
    """Run all Zameen scrapers"""
    print("=" * 60)
    print("STARTING ZAMEEN SCRAPERS")
    print("=" * 60)
    
    zameen_scrapers = [
        ("Zameen House Sales", "Zameen/Zameen_Homes.py"),
        ("Zameen House Rentals", "Zameen/Zameen_Homes_Rent.py"),
        ("Zameen Plot Sales", "Zameen/Zameen_Plots.py"),
        ("Zameen Commercial Sales", "Zameen/Zameen_Commercial.py"),
        ("Zameen Commercial Rentals", "Zameen/Zameen_Commercial_Rent.py")
    ]
    
    results = {}
    
    for name, script_path in zameen_scrapers:
        if os.path.exists(script_path):
            print(f"\n🔄 Running {name}...")
            start_time = time.time()
            
            try:
                # Import and run the scraper
                module_name = script_path.replace('/', '.').replace('.py', '')
                exec(f"import {module_name}")
                exec(f"{module_name}.main()")
                
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "SUCCESS", "duration": duration}
                print(f"✅ {name} completed successfully in {duration:.2f} seconds")
                
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "FAILED", "duration": duration, "error": str(e)}
                print(f"❌ {name} failed: {str(e)}")
        else:
            print(f"⚠️  {name} script not found: {script_path}")
            results[name] = {"status": "NOT_FOUND", "duration": 0}
    
    return results

def print_summary(all_results):
    """Print a summary of all scraper results"""
    print("\n" + "=" * 80)
    print("SCRAPING SUMMARY")
    print("=" * 80)
    
    total_scrapers = len(all_results)
    successful = sum(1 for r in all_results.values() if r["status"] == "SUCCESS")
    failed = sum(1 for r in all_results.values() if r["status"] == "FAILED")
    not_found = sum(1 for r in all_results.values() if r["status"] == "NOT_FOUND")
    
    print(f"Total Scrapers: {total_scrapers}")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"⚠️  Not Found: {not_found}")
    
    total_duration = sum(r["duration"] for r in all_results.values())
    print(f"⏱️  Total Duration: {total_duration:.2f} seconds")
    
    print("\nDetailed Results:")
    print("-" * 80)
    
    for name, result in all_results.items():
        status_emoji = {
            "SUCCESS": "✅",
            "FAILED": "❌",
            "NOT_FOUND": "⚠️"
        }
        
        emoji = status_emoji.get(result["status"], "❓")
        duration = result["duration"]
        
        if result["status"] == "SUCCESS":
            print(f"{emoji} {name}: {result['status']} ({duration:.2f}s)")
        elif result["status"] == "FAILED":
            print(f"{emoji} {name}: {result['status']} ({duration:.2f}s) - {result.get('error', 'Unknown error')}")
        else:
            print(f"{emoji} {name}: {result['status']}")

def check_data_files():
    """Check and display information about generated data files"""
    print("\n" + "=" * 80)
    print("DATA FILES CHECK")
    print("=" * 80)
    
    data_dirs = ["Graana/Data", "Zameen/Data"]
    
    for data_dir in data_dirs:
        if os.path.exists(data_dir):
            print(f"\n📁 {data_dir}:")
            files = os.listdir(data_dir)
            json_files = [f for f in files if f.endswith('.json')]
            
            if json_files:
                for json_file in sorted(json_files):
                    file_path = os.path.join(data_dir, json_file)
                    file_size = os.path.getsize(file_path)
                    file_size_mb = file_size / (1024 * 1024)
                    
                    # Try to count lines in JSON file
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            lines = sum(1 for _ in f)
                        print(f"  📄 {json_file}: {file_size_mb:.2f} MB, {lines:,} lines")
                    except:
                        print(f"  📄 {json_file}: {file_size_mb:.2f} MB")
            else:
                print("  No JSON files found")
        else:
            print(f"\n📁 {data_dir}: Directory not found")

def main():
    """Main function to run all scrapers"""
    parser = argparse.ArgumentParser(description='Run FYP Scrapers for Graana and Zameen')
    parser.add_argument('--graana', action='store_true', help='Run only Graana scrapers')
    parser.add_argument('--zameen', action='store_true', help='Run only Zameen scrapers')
    parser.add_argument('--check-data', action='store_true', help='Only check existing data files')
    parser.add_argument('--summary', action='store_true', help='Show summary of existing data files')
    
    args = parser.parse_args()
    
    print("🏠 FYP SCRAPERS - Graana & Zameen")
    print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if args.check_data or args.summary:
        check_data_files()
        return
    
    all_results = {}
    
    # Run scrapers based on arguments
    if args.graana:
        all_results.update(run_graana_scrapers())
    elif args.zameen:
        all_results.update(run_zameen_scrapers())
    else:
        # Run all scrapers by default
        all_results.update(run_graana_scrapers())
        all_results.update(run_zameen_scrapers())
    
    # Print summary
    print_summary(all_results)
    
    # Check data files
    check_data_files()
    
    print(f"\n🕐 Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🎉 All scrapers finished!")

if __name__ == "__main__":
    main()


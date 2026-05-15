#!/usr/bin/env python3
"""
Main orchestration script for property scraping and ingestion.
Runs all scrapers, generates chunked JSON files, and updates Supabase database.
"""

import os
import sys
import time
import argparse
from datetime import datetime
from pathlib import Path

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


def run_graana_scrapers():
    """Run all Graana scrapers."""
    print("=" * 80)
    print("RUNNING GRANA SCRAPERS")
    print("=" * 80)
    
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
                # Import and run the scraper module
                module_name = script_path.replace('/', '.').replace('\\', '.').replace('.py', '')
                module = __import__(module_name, fromlist=[''])
                if hasattr(module, 'main'):
                    module.main()
                else:
                    # Try to instantiate and run the scraper class
                    scraper_class = None
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if (isinstance(attr, type) and 
                            hasattr(attr, 'run') and 
                            'Scraper' in attr_name):
                            scraper_class = attr
                            break
                    
                    if scraper_class:
                        scraper = scraper_class()
                        scraper.run(use_multi_threading=True, max_workers=10)
                    else:
                        raise Exception("Could not find scraper class or main function")
                
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "SUCCESS", "duration": duration}
                print(f"✅ {name} completed successfully in {duration:.2f} seconds")
                
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "FAILED", "duration": duration, "error": str(e)}
                print(f"❌ {name} failed: {str(e)}")
                import traceback
                traceback.print_exc()
        else:
            print(f"⚠️  {name} script not found: {script_path}")
            results[name] = {"status": "NOT_FOUND", "duration": 0}
    
    return results


def run_lamudi_scrapers():
    """Run all Lamudi scrapers."""
    print("\n" + "=" * 80)
    print("RUNNING LAMUDI SCRAPERS")
    print("=" * 80)
    
    lamudi_scrapers = [
        ("Lamudi House Sales", "Lamudi/Lamudi_Homes.py"),
        ("Lamudi House Rentals", "Lamudi/Lamudi_Homes_Rent.py"),
        ("Lamudi Plot Sales", "Lamudi/Lamudi_Plots.py"),
        ("Lamudi Commercial Sales", "Lamudi/Lamudi_Commercial.py"),
        ("Lamudi Commercial Rentals", "Lamudi/Lamudi_Commercial_Rent.py")
    ]
    
    results = {}
    
    for name, script_path in lamudi_scrapers:
        if os.path.exists(script_path):
            print(f"\n🔄 Running {name}...")
            start_time = time.time()
            
            try:
                # Import and run the scraper module
                module_name = script_path.replace('/', '.').replace('\\', '.').replace('.py', '')
                module = __import__(module_name, fromlist=[''])
                if hasattr(module, 'main'):
                    module.main()
                else:
                    # Try to instantiate and run the scraper class
                    scraper_class = None
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if (isinstance(attr, type) and 
                            hasattr(attr, 'run') and 
                            'Scraper' in attr_name):
                            scraper_class = attr
                            break
                    
                    if scraper_class:
                        scraper = scraper_class()
                        scraper.run(use_multi_threading=True, max_workers=10)
                    else:
                        raise Exception("Could not find scraper class or main function")
                
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "SUCCESS", "duration": duration}
                print(f"✅ {name} completed successfully in {duration:.2f} seconds")
                
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "FAILED", "duration": duration, "error": str(e)}
                print(f"❌ {name} failed: {str(e)}")
                import traceback
                traceback.print_exc()
        else:
            print(f"⚠️  {name} script not found: {script_path}")
            results[name] = {"status": "NOT_FOUND", "duration": 0}
    
    return results


def run_zameen_scrapers():
    """Run all Zameen scrapers."""
    print("\n" + "=" * 80)
    print("RUNNING ZAMEEN SCRAPERS")
    print("=" * 80)
    
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
                # Import and run the scraper module
                module_name = script_path.replace('/', '.').replace('\\', '.').replace('.py', '')
                module = __import__(module_name, fromlist=[''])
                if hasattr(module, 'main'):
                    module.main()
                else:
                    # Try to instantiate and run the scraper class
                    scraper_class = None
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if (isinstance(attr, type) and 
                            hasattr(attr, 'run') and 
                            'Scraper' in attr_name):
                            scraper_class = attr
                            break
                    
                    if scraper_class:
                        scraper = scraper_class()
                        scraper.run(use_multi_threading=True, max_workers=10)
                    else:
                        raise Exception("Could not find scraper class or main function")
                
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "SUCCESS", "duration": duration}
                print(f"✅ {name} completed successfully in {duration:.2f} seconds")
                
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                results[name] = {"status": "FAILED", "duration": duration, "error": str(e)}
                print(f"❌ {name} failed: {str(e)}")
                import traceback
                traceback.print_exc()
        else:
            print(f"⚠️  {name} script not found: {script_path}")
            results[name] = {"status": "NOT_FOUND", "duration": 0}
    
    return results


def run_ingestion():
    """Run Supabase ingestion."""
    print("\n" + "=" * 80)
    print("RUNNING SUPABASE INGESTION")
    print("=" * 80)
    
    start_time = time.time()
    
    try:
        from ingest_to_supabase import ingest_all
        ingest_all()
        
        end_time = time.time()
        duration = end_time - start_time
        return {"status": "SUCCESS", "duration": duration}
    except Exception as e:
        end_time = time.time()
        duration = end_time - start_time
        print(f"❌ Ingestion failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"status": "FAILED", "duration": duration, "error": str(e)}


def print_summary(all_results, ingestion_result):
    """Print a summary of all results."""
    print("\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    
    total_scrapers = sum(len(results) for results in all_results.values())
    successful = sum(
        sum(1 for r in results.values() if r["status"] == "SUCCESS")
        for results in all_results.values()
    )
    failed = sum(
        sum(1 for r in results.values() if r["status"] == "FAILED")
        for results in all_results.values()
    )
    
    print(f"Scrapers:")
    print(f"  Total: {total_scrapers}")
    print(f"  ✅ Successful: {successful}")
    print(f"  ❌ Failed: {failed}")
    
    if ingestion_result:
        print(f"\nIngestion:")
        print(f"  Status: {ingestion_result['status']}")
        print(f"  Duration: {ingestion_result['duration']:.2f} seconds")
        if ingestion_result['status'] == "FAILED":
            print(f"  Error: {ingestion_result.get('error', 'Unknown')}")
    
    total_duration = sum(
        sum(r["duration"] for r in results.values())
        for results in all_results.values()
    )
    if ingestion_result:
        total_duration += ingestion_result["duration"]
    
    print(f"\n⏱️  Total Duration: {total_duration:.2f} seconds")
    print("=" * 80)


def main():
    """Main function to run all scrapers and ingestion."""
    parser = argparse.ArgumentParser(
        description='Run all property scrapers and ingest to Supabase',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_all.py                    # Run all scrapers and ingestion
  python run_all.py --scrape-only       # Only run scrapers, skip ingestion
  python run_all.py --ingest-only       # Only run ingestion, skip scrapers
  python run_all.py --graana-only       # Only run Graana scrapers
  python run_all.py --lamudi-only       # Only run Lamudi scrapers
  python run_all.py --zameen-only       # Only run Zameen scrapers
        """
    )
    parser.add_argument('--scrape-only', action='store_true', 
                       help='Only run scrapers, skip ingestion')
    parser.add_argument('--ingest-only', action='store_true', 
                       help='Only run ingestion, skip scrapers')
    parser.add_argument('--graana-only', action='store_true', 
                       help='Only run Graana scrapers')
    parser.add_argument('--lamudi-only', action='store_true', 
                       help='Only run Lamudi scrapers')
    parser.add_argument('--zameen-only', action='store_true', 
                       help='Only run Zameen scrapers')
    
    args = parser.parse_args()
    
    print("🏠 PROPERTY SCRAPING AND INGESTION SYSTEM")
    print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    all_results = {}
    ingestion_result = None
    
    # Run scrapers
    if not args.ingest_only:
        if args.graana_only:
            all_results["Graana"] = run_graana_scrapers()
        elif args.lamudi_only:
            all_results["Lamudi"] = run_lamudi_scrapers()
        elif args.zameen_only:
            all_results["Zameen"] = run_zameen_scrapers()
        else:
            # Run all scrapers
            all_results["Graana"] = run_graana_scrapers()
            all_results["Lamudi"] = run_lamudi_scrapers()
            all_results["Zameen"] = run_zameen_scrapers()
    
    # Run ingestion
    if not args.scrape_only:
        ingestion_result = run_ingestion()
    
    # Print summary
    print_summary(all_results, ingestion_result)
    
    print(f"\n🕐 Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🎉 All tasks finished!")


if __name__ == "__main__":
    main()


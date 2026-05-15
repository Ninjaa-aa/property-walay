#!/usr/bin/env python3
"""
Simple test to verify Supabase connection without .env file
"""

from supabase import create_client, Client

def test_supabase_connection():
    """Test the Supabase connection with hardcoded credentials for testing"""
    
    # You need to replace these with your actual Supabase credentials
    # Get these from your Supabase Dashboard > Settings > API
    SUPABASE_URL = "https://jicaojwemqdwzznvmujy.supabase.co"  # Replace with your URL
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY2FvandlbXFkd3p6bnZtdWp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ5NzcwMSwiZXhwIjoyMDc2MDczNzAxfQ.z9-1Hdc-JBkSow-S7rTcp0m2v0qq8cCD6f3l3fiddnU"  # Replace with your service role key
    
    if SUPABASE_URL == "https://your-project-id.supabase.co" or SUPABASE_KEY == "your-service-role-key-here":
        print("ERROR: Please update the credentials in this script first!")
        print("Get your credentials from Supabase Dashboard > Settings > API")
        print("Then replace the SUPABASE_URL and SUPABASE_KEY variables in this script")
        return False
    
    try:
        # Create Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("Testing Supabase connection...")
        
        # Try to query a simple table (this will fail if tables don't exist yet, but connection will work)
        try:
            result = supabase.table("properties").select("count").limit(1).execute()
            print("SUPABASE CONNECTION SUCCESSFUL!")
            print("Database is accessible and tables exist")
            return True
        except Exception as e:
            if "relation \"properties\" does not exist" in str(e):
                print("SUPABASE CONNECTION SUCCESSFUL!")
                print("WARNING: Database tables don't exist yet - you need to run the schema first")
                return True
            else:
                print(f"Database query failed: {e}")
                return False
                
    except Exception as e:
        print(f"Supabase connection failed: {e}")
        print("\nTroubleshooting:")
        print("1. Check your SUPABASE_URL is correct")
        print("2. Check your SUPABASE_SERVICE_ROLE_KEY is correct")
        print("3. Make sure your Supabase project is active")
        return False

if __name__ == "__main__":
    print("FYP Scrappers - Supabase Connection Test")
    print("=" * 50)
    
    success = test_supabase_connection()
    
    if success:
        print("\nSUCCESS: Connection test passed! You can proceed with the next steps.")
    else:
        print("\nFAILED: Connection test failed! Please fix the issues above.")

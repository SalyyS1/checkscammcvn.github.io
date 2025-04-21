#!/usr/bin/env python3
"""
Update metadata.json with current statistics from reports.json
This script is run by GitHub Actions during deployment
"""

import json
import os
import datetime

def update_metadata():
    """Update metadata.json with current statistics"""
    # Path to data files
    reports_path = os.path.join('data', 'reports.json')
    metadata_path = os.path.join('data', 'metadata.json')
    
    # Read reports data
    try:
        with open(reports_path, 'r', encoding='utf-8') as f:
            reports = json.load(f)
    except Exception as e:
        print(f"Error reading reports.json: {e}")
        return False
    
    # Calculate statistics
    total_reports = len(reports)
    verified_reports = sum(1 for r in reports if r.get('status') == 'verified')
    resolved_reports = sum(1 for r in reports if r.get('status') == 'resolved')
    false_reports = sum(1 for r in reports if r.get('status') == 'false-report')
    pending_reports = sum(1 for r in reports if r.get('status') == 'pending')
    
    # Calculate total votes
    total_votes = sum(
        (r.get('votes', {}).get('confirm', 0) + r.get('votes', {}).get('deny', 0))
        for r in reports
    )
    
    # Create metadata
    metadata = {
        "last_updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_reports": total_reports,
        "verified_reports": verified_reports,
        "resolved_reports": resolved_reports,
        "false_reports": false_reports,
        "pending_reports": pending_reports,
        "total_votes": total_votes
    }
    
    # Write metadata
    try:
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        print("Metadata updated successfully")
        return True
    except Exception as e:
        print(f"Error writing metadata.json: {e}")
        return False

if __name__ == "__main__":
    update_metadata()

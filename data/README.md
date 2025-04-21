# Data Storage Structure for CheckScamMCVN

This document outlines the data storage structure for the CheckScamMCVN website, which is designed to be hosted on GitHub Pages.

## Overview

The data storage system uses JSON files stored in the GitHub repository. This approach allows:
- Transparent access to all data
- Version control and history tracking
- Community contribution through pull requests
- Simple integration with GitHub Pages

## File Structure

```
checkscammcvn/
├── data/
│   ├── reports.json       # Main data file containing all scam reports
│   ├── metadata.json      # Website metadata and statistics
│   └── servers.json       # List of Minecraft servers for the dropdown
```

## Schema Definitions

### reports.json

This file contains an array of report objects with the following structure:

```json
[
  {
    "id": "SCAM-0001",           // Unique identifier for the report
    "name": "MinecraftUser",     // Minecraft username
    "discord": "123456789012345678", // Discord ID (numeric)
    "discord_name": "username",  // Discord username (optional)
    "facebook": "https://facebook.com/user", // Facebook link (optional)
    "server": "ServerName",      // Minecraft server where scam occurred
    "date": "2025-04-21",        // Report date in YYYY-MM-DD format
    "description": "Description of the scam incident", // Details
    "proof": [                   // Array of proof image URLs
      "https://i.imgur.com/image1.png",
      "https://i.imgur.com/image2.png"
    ],
    "status": "pending",         // Status: pending, verified, resolved, false-report
    "votes": {                   // Community verification votes
      "confirm": 5,              // Number of confirmations
      "deny": 1                  // Number of denials
    }
  }
]
```

### metadata.json

This file contains website metadata and statistics:

```json
{
  "last_updated": "2025-04-21T12:34:56Z", // ISO timestamp of last update
  "total_reports": 42,                    // Total number of reports
  "verified_reports": 30,                 // Number of verified reports
  "resolved_reports": 5,                  // Number of resolved reports
  "false_reports": 2,                     // Number of false reports
  "pending_reports": 5,                   // Number of pending reports
  "total_votes": 256                      // Total number of community votes
}
```

### servers.json

This file contains the list of Minecraft servers for the dropdown selection:

```json
[
  {
    "id": "aemcstudio",
    "name": "AEMCStudio",
    "website": "https://aemcstudio.com"
  },
  {
    "id": "mmovnstudio",
    "name": "MMOVNStudio",
    "website": "https://mmovnstudio.com"
  },
  {
    "id": "stellastudio",
    "name": "StellaStudio",
    "website": "https://stellastudio.com"
  }
]
```

## Data Flow

1. **Reading Data**:
   - The website loads data from the JSON files at startup
   - Search functionality queries the loaded data
   - Report details are displayed from the loaded data

2. **Writing Data**:
   - New reports are submitted through the web interface
   - The submission creates a GitHub Pull Request
   - Administrators review and merge the PR
   - GitHub Actions rebuild the site with the updated data

3. **Voting**:
   - Community votes are submitted through the web interface
   - Votes create a GitHub PR to update the report's vote counts
   - Administrators review and merge the PR
   - Status may be automatically updated based on vote thresholds

## GitHub Integration

The website integrates with GitHub in the following ways:

1. **Pull Requests for New Reports**:
   - When a user submits a report, a PR is created
   - The PR adds the new report to reports.json
   - Administrators can review the report before merging

2. **Pull Requests for Votes**:
   - When a user votes on a report, a PR is created
   - The PR updates the vote counts in reports.json
   - Administrators can review the vote before merging

3. **GitHub Actions for Automation**:
   - GitHub Actions workflow rebuilds the site when data changes
   - Workflow updates metadata.json with current statistics
   - Workflow can automatically update report status based on votes

## Security Considerations

1. **Data Validation**:
   - All user inputs are validated before submission
   - Required fields are enforced
   - Discord IDs are validated to be numeric
   - URLs are validated for proper format

2. **Abuse Prevention**:
   - Reports are reviewed before being published
   - Voting requires GitHub authentication (in production)
   - Rate limiting can be implemented for submissions

3. **Privacy Protection**:
   - Reporter information is not stored or displayed
   - Only public information about the reported user is stored

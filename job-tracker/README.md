# Job Application Tracker Dashboard

A modern web-based dashboard for tracking job applications, built with Streamlit.

## Features

- 📊 **Overview Dashboard**: See statistics at a glance (total applications, status breakdown)
- ➕ **Add Applications**: Easily add new job applications with company, role, and status
- ✏️ **Update Status**: Change application status as you progress through the hiring process
- 🗑️ **Delete Applications**: Remove applications you no longer want to track
- 🔍 **Filter by Status**: View applications based on their current status
- 🎨 **Color-Coded Status**: Visual indicators for different application statuses
  - 🟢 Accepted (Green)
  - 🔵 Interviewing (Blue)
  - 🟡 Applied (Yellow)
  - 🔴 Rejected (Red)

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Running the Dashboard

To start the Streamlit dashboard:

```bash
streamlit run dashboard.py
```

The dashboard will automatically open in your default web browser at `http://localhost:8501`

### Running the Terminal Version

The original command-line interface is still available:

```bash
python tracker.py
```

## Database

Both the dashboard and terminal version use the same SQLite database (`job_applications.db`), so your data is shared between both interfaces.

## Application Statuses

- **Applied**: You've submitted your application
- **Interviewing**: You're in the interview process
- **Accepted**: You've received an offer or been accepted
- **Rejected**: The application was unsuccessful

## Tips

- Use the sidebar to quickly add new applications
- The overview section shows your application pipeline at a glance
- Filter applications to focus on specific statuses
- All changes are saved automatically to the database

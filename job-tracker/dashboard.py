import streamlit as st
import sqlite3
import pandas as pd
import datetime
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(SCRIPT_DIR, 'job_applications.db')

def initialize_database():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS job_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            date_applied TEXT NOT NULL,
            status TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def get_all_applications():
    conn = sqlite3.connect(DATABASE_NAME)
    df = pd.read_sql_query("SELECT * FROM job_applications ORDER BY date_applied DESC", conn)
    conn.close()
    return df

def add_application(company, role, status):
    date_applied = datetime.date.today().isoformat()
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO job_applications (company, role, date_applied, status) VALUES (?, ?, ?, ?)",
              (company, role, date_applied, status))
    conn.commit()
    conn.close()

def update_application_status(app_id, new_status):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("UPDATE job_applications SET status = ? WHERE id = ?", (new_status, app_id))
    conn.commit()
    conn.close()

def delete_application(app_id):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM job_applications WHERE id = ?", (app_id,))
    conn.commit()
    conn.close()

def get_statistics():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    
    c.execute("SELECT COUNT(*) FROM job_applications")
    total = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM job_applications WHERE status = 'Applied'")
    applied = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM job_applications WHERE status = 'Interviewing'")
    interviewing = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM job_applications WHERE status = 'Accepted'")
    accepted = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM job_applications WHERE status = 'Rejected'")
    rejected = c.fetchone()[0]
    
    conn.close()
    return total, applied, interviewing, accepted, rejected

# Page configuration
st.set_page_config(page_title="Job Application Tracker", page_icon="💼", layout="wide")

# Initialize database
initialize_database()

# Title
st.title("💼 Job Application Tracker")
st.markdown("---")

# Sidebar for adding new applications
with st.sidebar:
    st.header("➕ Add New Application")
    
    with st.form("add_application_form"):
        company = st.text_input("Company Name")
        role = st.text_input("Role/Position")
        status = st.selectbox("Status", ["Applied", "Interviewing", "Accepted", "Rejected"])
        
        submitted = st.form_submit_button("Add Application")
        if submitted:
            if company and role:
                add_application(company, role, status)
                st.success(f"✅ Added {company} - {role}")
                st.rerun()
            else:
                st.error("Please fill in all fields")

# Statistics Dashboard
st.header("📊 Overview")
total, applied, interviewing, accepted, rejected = get_statistics()

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("Total Applications", total)
with col2:
    st.metric("Applied", applied, delta=None)
with col3:
    st.metric("Interviewing", interviewing, delta=None)
with col4:
    st.metric("Accepted", accepted, delta=None)
with col5:
    st.metric("Rejected", rejected, delta=None)

st.markdown("---")

# Applications Table
st.header("📋 All Applications")

df = get_all_applications()

if not df.empty:
    # Add color coding based on status
    def color_status(val):
        if val == 'Accepted':
            return 'background-color: #d4edda; color: #155724'
        elif val == 'Rejected':
            return 'background-color: #f8d7da; color: #721c24'
        elif val == 'Interviewing':
            return 'background-color: #d1ecf1; color: #0c5460'
        elif val == 'Applied':
            return 'background-color: #fff3cd; color: #856404'
        return ''
    
    # Display the dataframe with styling
    styled_df = df.style.applymap(color_status, subset=['status'])
    st.dataframe(styled_df, use_container_width=True, hide_index=True)
    
    st.markdown("---")
    
    # Update/Delete Section
    st.header("✏️ Manage Applications")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Update Status")
        with st.form("update_form"):
            app_to_update = st.selectbox(
                "Select Application",
                options=df['id'].tolist(),
                format_func=lambda x: f"ID {x}: {df[df['id']==x]['company'].values[0]} - {df[df['id']==x]['role'].values[0]}"
            )
            new_status = st.selectbox("New Status", ["Applied", "Interviewing", "Accepted", "Rejected"])
            
            update_submitted = st.form_submit_button("Update Status")
            if update_submitted:
                update_application_status(app_to_update, new_status)
                st.success(f"✅ Updated application ID {app_to_update} to {new_status}")
                st.rerun()
    
    with col2:
        st.subheader("Delete Application")
        with st.form("delete_form"):
            app_to_delete = st.selectbox(
                "Select Application to Delete",
                options=df['id'].tolist(),
                format_func=lambda x: f"ID {x}: {df[df['id']==x]['company'].values[0]} - {df[df['id']==x]['role'].values[0]}"
            )
            
            delete_submitted = st.form_submit_button("Delete Application", type="primary")
            if delete_submitted:
                delete_application(app_to_delete)
                st.success(f"✅ Deleted application ID {app_to_delete}")
                st.rerun()
    
    # Filter by status
    st.markdown("---")
    st.header("🔍 Filter Applications")
    
    filter_status = st.multiselect(
        "Filter by Status",
        options=["Applied", "Interviewing", "Accepted", "Rejected"],
        default=["Applied", "Interviewing", "Accepted", "Rejected"]
    )
    
    if filter_status:
        filtered_df = df[df['status'].isin(filter_status)]
        st.dataframe(filtered_df, use_container_width=True, hide_index=True)
    
else:
    st.info("No applications found. Add your first application using the sidebar!")

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center'>
        <p>Job Application Tracker Dashboard | Built with Streamlit</p>
    </div>
    """,
    unsafe_allow_html=True
)

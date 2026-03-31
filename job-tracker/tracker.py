import sqlite3
import datetime

DATABASE_NAME = 'job_applications.db'

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

def add_application():
    company = input("Enter company name: ")
    role = input("Enter role: ")
    date_applied = datetime.date.today().isoformat()
    status = "Applied"

    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO job_applications (company, role, date_applied, status) VALUES (?, ?, ?, ?)",
              (company, role, date_applied, status))
    conn.commit()
    conn.close()
    print("Application added successfully!")

def view_active_applications():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT id, company, role, date_applied, status FROM job_applications WHERE status != 'Rejected'")
    applications = c.fetchall()
    conn.close()

    if not applications:
        print("No active applications found.")
        return

    print("\n--- Active Job Applications ---")
    for app in applications:
        print(f"ID: {app[0]}, Company: {app[1]}, Role: {app[2]}, Applied: {app[3]}, Status: {app[4]}")
    print("-----------------------------\n")

def update_application_status():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT id, company, role, status FROM job_applications")
    applications = c.fetchall()

    if not applications:
        print("No applications to update.")
        conn.close()
        return

    print("\n--- Select Application to Update ---")
    for app in applications:
        print(f"ID: {app[0]}, Company: {app[1]}, Role: {app[2]}, Current Status: {app[3]}")
    print("----------------------------------\n")

    try:
        app_id = int(input("Enter the ID of the application to update: "))
        c.execute("SELECT id FROM job_applications WHERE id = ?", (app_id,))
        if not c.fetchone():
            print("Invalid application ID.")
            conn.close()
            return

        print("Select new status:")
        print("1. Interviewing")
        print("2. Rejected")
        
        status_choice = input("Enter choice (1 or 2): ")
        new_status = ""
        if status_choice == '1':
            new_status = "Interviewing"
        elif status_choice == '2':
            new_status = "Rejected"
        else:
            print("Invalid status choice.")
            conn.close()
            return
        
        c.execute("UPDATE job_applications SET status = ? WHERE id = ?", (new_status, app_id))
        conn.commit()
        print(f"Application {app_id} status updated to '{new_status}'.")

    except ValueError:
        print("Invalid input. Please enter a number for the ID.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

def main_menu():
    initialize_database()
    while True:
        print("\n--- Job Tracker Menu ---")
        print("1. Add a new application")
        print("2. View all active applications")
        print("3. Update the status of an application")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            add_application()
        elif choice == '2':
            view_active_applications()
        elif choice == '3':
            update_application_status()
        elif choice == '4':
            print("Exiting Job Tracker. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main_menu()

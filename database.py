"""
Database module for Public Complaint Management System.
Uses SQLite for data persistence.
"""

import sqlite3
import os

DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pcms.db')


def get_db():
    """Get a database connection."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Initialize the database with all required tables."""
    conn = get_db()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'citizen' CHECK(role IN ('citizen', 'admin')),
            language_pref TEXT DEFAULT 'en' CHECK(language_pref IN ('en', 'ta', 'both')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Complaints table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_id TEXT UNIQUE NOT NULL,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            department TEXT NOT NULL,
            priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'resolved', 'escalated', 'closed')),
            latitude REAL,
            longitude REAL,
            address TEXT,
            escalation_level INTEGER DEFAULT 0,
            escalated_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Complaint media table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaint_media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            file_type TEXT NOT NULL CHECK(file_type IN ('image', 'video')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id)
        )
    ''')

    # Complaint status updates / timeline
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaint_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_id TEXT NOT NULL,
            old_status TEXT,
            new_status TEXT NOT NULL,
            comment TEXT,
            updated_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id),
            FOREIGN KEY (updated_by) REFERENCES users(id)
        )
    ''')

    # Create default admin user (password: admin123)
    from werkzeug.security import generate_password_hash
    admin_hash = generate_password_hash('admin123')
    cursor.execute('''
        INSERT OR IGNORE INTO users (name, email, phone, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
    ''', ('System Admin', 'admin@pcms.gov.in', '9999999999', admin_hash, 'admin'))

    # Create default citizen user (password: user123)
    user_hash = generate_password_hash('user123')
    cursor.execute('''
        INSERT OR IGNORE INTO users (name, email, phone, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
    ''', ('Citizen User', 'user@pcms.gov.in', '9876543210', user_hash, 'citizen'))

    conn.commit()

    # Clear sample demo complaints
    clear_demo_complaints(conn)

    conn.close()
    print("[OK] Database initialized successfully!")


def clear_demo_complaints(conn):
    """Remove all sample demo complaints."""
    cursor = conn.cursor()
    cursor.execute("DELETE FROM complaint_updates WHERE complaint_id LIKE 'PCMS-2026-DEP%'")
    cursor.execute("DELETE FROM complaint_media WHERE complaint_id LIKE 'PCMS-2026-DEP%'")
    cursor.execute("DELETE FROM complaints WHERE complaint_id LIKE 'PCMS-2026-DEP%'")
    conn.commit()


def seed_demo_complaints(conn):
    """Seed sample complaints across all 7 official departments."""
    cursor = conn.cursor()
    user = cursor.execute("SELECT id FROM users WHERE role='citizen' LIMIT 1").fetchone()
    if not user:
        return

    user_id = user['id']

    demo_7_complaints = [
        {
            'dept': 'Sanitation & Solid Waste / குப்பை மற்றும் தூய்மை',
            'title': 'Overflowing Garbage Bin near Bus Stand / பஸ் ஸ்டாண்ட் அருகில் குப்பை குவிந்துள்ளது',
            'desc': 'Garbage has not been collected for 3 days near the main bus stop area causing bad odor.',
            'cat': 'Sanitation', 'prio': 'high', 'status': 'pending'
        },
        {
            'dept': 'Water Supply & Drainage / குடிநீர் மற்றும் வடிகால்',
            'title': 'Broken Water Pipe & Underground Leakage / குடிநீர் குழாய் உடைந்து நீர் வீணாகிறது',
            'desc': 'Main drinking water pipeline is leaking on 2nd cross street.',
            'cat': 'Water Supply', 'prio': 'urgent', 'status': 'in_progress'
        },
        {
            'dept': 'Roads & Pavements / சாலை மற்றும் நடைபாதை',
            'title': 'Deep Potholes on Main Road / பிரதான சாலையில் பெரிய பள்ளங்கள்',
            'desc': 'Dangerous potholes causing accidents during night time near market junction.',
            'cat': 'Road Maintenance', 'prio': 'high', 'status': 'in_progress'
        },
        {
            'dept': 'Street Lights & Electricity / தெருவிளக்கு மற்றும் மின்சாரம்',
            'title': 'Non-Functional Street Lights at Night / தெருவிளக்குகள் எரியவில்லை',
            'desc': 'Street lights are not working for the past 5 days in residential sector 4.',
            'cat': 'Electricity', 'prio': 'medium', 'status': 'pending'
        },
        {
            'dept': 'Stray Animals Control / தெரு விலங்குகள் கட்டுப்பாடு',
            'title': 'Stray Dogs Nuisance near School Zone / பள்ளி அருகே தெருநாய்கள் தொல்லை',
            'desc': 'Pack of stray dogs chasing school children near primary school gate.',
            'cat': 'Animal Control', 'prio': 'high', 'status': 'resolved'
        },
        {
            'dept': 'Public Parks & Facilities / பூங்கா மற்றும் பொது இடங்கள்',
            'title': 'Damaged Play Equipment in Childrens Park / பூங்காவில் உடைந்த விளையாட்டுகள்',
            'desc': 'Swings and benches damaged in central park needing urgent repair.',
            'cat': 'Public Facilities', 'prio': 'low', 'status': 'resolved'
        },
        {
            'dept': 'Local Traffic & Encroachment / போக்குவரத்து மற்றும் ஆக்கிரமிப்புகள்',
            'title': 'Illegal Shop Encroachment on Footpath / நடைபாதையில் கடைகள் ஆக்கிரமிப்பு',
            'desc': 'Temporary shops blocking pedestrian sidewalk forcing people onto busy road.',
            'cat': 'Encroachment', 'prio': 'medium', 'status': 'escalated'
        }
    ]

    import uuid, datetime
    for i, c in enumerate(demo_7_complaints):
        # Check if complaint for this department exists
        existing = cursor.execute("SELECT id FROM complaints WHERE department = ?", (c['dept'],)).fetchone()
        if not existing:
            comp_id = f"PCMS-2026-DEP{i+1}0"
            cursor.execute('''
                INSERT INTO complaints (complaint_id, user_id, title, description, category, department, priority, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (comp_id, user_id, c['title'], c['desc'], c['cat'], c['dept'], c['prio'], c['status']))

            cursor.execute('''
                INSERT INTO complaint_updates (complaint_id, old_status, new_status, comment)
                VALUES (?, ?, ?, ?)
            ''', (comp_id, 'pending', c['status'], f"Complaint registered for {c['cat']}"))

    conn.commit()


if __name__ == '__main__':
    init_db()

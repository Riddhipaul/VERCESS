from flask import Flask, g, request, jsonify
import sqlite3

app = Flask(__name__)

# Define the path to the SQLite database
DATABASE = 'mydatabase.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                Date TEXT,
                ChatConversation TEXT
            );
        """)
        db.commit()

@app.route('/initdb')
def initdb():
    init_db()
    return 'Database initialized'

@app.route('/')
def index():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT sqlite_version();")
    version = cursor.fetchone()
    return f"SQLite Version: {version[0]}"

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    date = data.get('date')
    chat_conversation = data.get('chat_conversation')

    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO users (name, email, Date, ChatConversation) VALUES ('John','joh@gmail.com' , '28Nov', 'Hi:Hello')",
                   (name, email, date, chat_conversation))
    db.commit()
    return jsonify({'message': 'User added', 'user_id': cursor.lastrowid})

@app.route('/get_users', methods=['GET'])
def get_users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True)


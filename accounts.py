from database import Database
import json

class Accounts(Database):
    def createTableAccounts(self):
        conn = self.conn
        conn.cursor().execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        student_no TEXT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        fname TEXT NULL,
                        lname TEXT NULL,
                        contact TEXT NULL,
                        address TEXT NULL,
                        profle TEXT NULL,
                        status INTEGER NOT NULL
                    )''')
        conn.commit()
        print("Table Account Created!")
        conn.close()

    def insertAccounts(self, student_no, email, password, fname, lname, contact=None, address=None, profile='profile.png', status=1):
        conn = self.conn
        cursor = conn.cursor()
        
        try:
            # Check if the email already exists
            cursor.execute('''
                SELECT COUNT(*) FROM users WHERE email = ?
            ''', (email,))
            
            email_exists = cursor.fetchone()[0] > 0
            
            if email_exists:
                return 0
            else:
                # Insert the new record
                cursor.execute('''
                    INSERT INTO users (student_no, email, password, fname, lname, contact, address, profle, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (student_no, email, password, fname, lname, contact, address, profile, status))
                conn.commit()
                return 1
        
        except Exception as e:
            conn.rollback()  # Rollback in case of error
            return f"An error occurred: {str(e)}"
        
        finally:
            cursor.close()
            # It's generally a good idea to not close the connection here if it's managed by a higher level in your class.
            # conn.close()  # Uncomment if you are managing connection closure here.

    def log_account(self, email, password):
        conn = self.conn
        cursor = conn.cursor()
        
        # Query to check if the email and password match a record and retrieve the status
        cursor.execute('''
            SELECT status
            FROM users
            WHERE email = ? AND password = ?
        ''', (email, password))
        
        result = cursor.fetchone()
        
        if result:
            status = result[0]  # Assuming status is the first (and only) field retrieved
            if status == 1:
                return 1
            elif status == 0:
                return 0
        else:
            return 2
        
        conn.close()
    
    def getAccounts(self):
        conn = self.conn
        cursor = conn.cursor()

        try:
            # Fetch data from the users table
            cursor.execute('SELECT * FROM users;')  # Select all data from the table
            rows = cursor.fetchall()

            # Get column names from the cursor description
            column_names = [description[0] for description in cursor.description]

            # Format rows as a list of dictionaries
            data = [dict(zip(column_names, row)) for row in rows]

        finally:
            conn.close()  # Ensure the connection is closed properly
        
        # Return the data as JSON
        return json.dumps(data, indent=4)  
import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('basurahunt.db')
    
class TrashLogs(Database):
    def createTableTrashLogs(self):
        conn = self.conn
        conn.cursor().execute('''
        CREATE TABLE IF NOT EXISTS trashLogs (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              date TEXT NOT NULL,
                              message TEXT NOT NULL,
                              percent INTEGER NOT NULL
                              );
    ''')
        conn.commit()
        # print("Table Trash Logs Created!")
        conn.close()

class TrashCount(Database):
    def createTableTrashCount(self):
        conn = self.conn
        conn.cursor().execute('''
        CREATE TABLE IF NOT EXISTS trashCount (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              count INTEGER NOT NULL
                              );
    ''')
        conn.commit()
        # print("Table Trash Count Created!")
        conn.close()
    
    def updateTrashCount(self, count):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('''
        UPDATE trashCount SET count = ? WHERE id = 1;
        ''', (count,))
        conn.commit()
        print("Trash Count Updated!")
        conn.close()

    
    def updateTrashCount2(self, count):
        conn = self.conn
        conn.cursor().execute(f'''
        UPDATE trashCount SET count = {count} WHERE id = 2;
    ''')
        conn.commit()
        # print("Trash Count Updated!")
        # conn.close()
    
    # We encounter error snce we forget to remove the count parameter
    def getTrashCount(self):
        conn = self.conn
        data = conn.cursor().execute(f'''
        SELECT count FROM trashCount WHERE id = 1;
    ''').fetchone()
        print(f"Retrieved id = {data} Count!")
        conn.close()
        return data
    
    def getTrashCount2(self):
        conn = self.conn
        data = conn.cursor().execute(f'''
        SELECT count FROM trashCount WHERE id = 2;
    ''').fetchone()
        print(f"Retrieved id = {data} Count!")
        conn.close()
        return data

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

    def insertAccounts(self, student_no, email, password, fname=None, lname=None, contact=None, address=None, profile=None, status=1):
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




    
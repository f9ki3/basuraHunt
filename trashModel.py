import sqlite3, json
from datetime import datetime

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

class StudentReport(Database):
    def createTableStudentReport(self):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS  studentReport (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,  -- Changed to INTEGER to match the id type in users
                date DATETIME NOT NULL,
                description TEXT NOT NULL,
                media TEXT NOT NULL,
                status TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES users(id)  -- Foreign key constraint
            );
        ''')
        conn.commit()  # Commit the transaction
        print("Table Student Report Created!")
        conn.close()   # Close the connection properly
    
    def insertStudentReport(self, student_id, description, media):
        conn = self.conn
        cursor = conn.cursor()
        # Insert data into the studentReport table
        cursor.execute('''
            INSERT INTO studentReport (date, student_id, description, media, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (datetime.now(), student_id, description, media, '0'))
        conn.commit()
        print("Student Report inserted!")
        conn.close()  # Close the connection properly
    
    def getStudentReport(self):
        conn = self.conn
        cursor = conn.cursor()

        # Fetch data from the studentReport table
        cursor.execute('''
                    -- Example query to join users and studentReport
                        SELECT 
                            ur.id AS user_id,
                            ur.fname AS user_first_name,
                            ur.lname AS user_last_name,
                            ur.email AS user_email,
                            ur.contact AS user_contact,
                            sr.id AS report_id,
                            sr.date AS report_date,
                            sr.description AS report_description,
                            sr.media AS report_media,
                            sr.status AS report_status
                        FROM 
                            studentReport sr
                        JOIN 
                            users ur
                        ON 
                            sr.student_id = ur.id;
        ''')  # Select all data from table
        rows = cursor.fetchall()

        # Get column names from the cursor description
        column_names = [description[0] for description in cursor.description]

        # Format rows as a list of dictionaries
        data = [dict(zip(column_names, row)) for row in rows]

        conn.close()  # Close the connection properly
        
        # Return the data as JSON
        return json.dumps(data, indent=4)  # Convert Python data to JSON format

    def get_session(self, email, password):
        # Data to be used in the query
        data = (email, password)
        
        # Get database connection
        conn = self.conn
        cursor = conn.cursor()
        
        # Execute query
        cursor.execute('''
            SELECT * FROM users WHERE email = ? AND password = ?
        ''', data)
        
        # Fetch one result
        result = cursor.fetchone()
        
        # Close the connection properly
        conn.close()
        
        # Check if result is found
        if result:
            print("Student Fetch Session!")
            
            # Convert result tuple to dictionary
            column_names = [description[0] for description in cursor.description]
            result_dict = dict(zip(column_names, result))
            
            # Convert dictionary to JSON
            result_json = json.dumps(result_dict)
            
            print(result_json)
            return result_json
        else:
            print("No matching user found.")
            return json.dumps({"error": "No matching user found."})
        
    def deleteReport(self, id):
        conn = self.conn
        cursor = conn.cursor()
        
        # Corrected SQL syntax
        cursor.execute('''
            DELETE FROM studentReport WHERE id = ?
        ''', (id,))  # id should be passed as a tuple
        print('Deleted Report Succes')
        conn.commit()
    
    def updateStudentReport(self, report_id, report_desc, media_filename):
        conn = self.conn
        cursor = conn.cursor()
        
        # Corrected SQL query
        cursor.execute('''
            UPDATE studentReport SET description = ?, media = ? WHERE id = ?
        ''', (report_desc, media_filename, report_id))  # Pass the correct variables in the tuple
        
        print('Updated Report Success')
        conn.commit()
    
    def updateStudentReportMedia(self, report_id, report_desc):
        conn = self.conn
        cursor = conn.cursor()
        
        # Corrected SQL query to update the description for the given report_id
        cursor.execute('''
            UPDATE studentReport SET description = ? WHERE id = ?
        ''', (report_desc, report_id))  # Correctly pass both description and ID
        
        print('Updated Report Success')
        conn.commit()
    
    def updateStudentReportStatusResponding(self, report_id, status):
        conn = self.conn
        cursor = conn.cursor()
        
        # Corrected SQL query to update the description for the given report_id
        cursor.execute('''
            UPDATE studentReport SET status = ? WHERE id = ?
        ''', (status, report_id))  # Correctly pass both description and ID
        
        print('Updated Report Status Responding')
        conn.commit()




# if __name__ == "__main__":
#     Database()
#     Accounts().createTableAccounts()
#     TrashLogs().createTableTrashLogs()
#     TrashCount().createTableTrashCount()
#     StudentReport().get_session('idan@yahoo.com', 'idan')
    #   StudentReport().createTableStudentReport()
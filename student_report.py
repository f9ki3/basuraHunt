from datetime import datetime
from database import Database
import json

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
    
    def insertStudentReport(self, student_id, description, media, strand, section):
        conn = self.conn
        cursor = conn.cursor()
        
        # Insert data into the studentReport table, including strand and section
        cursor.execute('''
            INSERT INTO studentReport (date, student_id, description, media, status, strand, section)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (datetime.now(), student_id, description, media, '0', strand, section))
        
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

    def getStudentReportProfile(self, id):
        conn = self.conn  # Assuming self.conn is a valid connection object
        cursor = conn.cursor()

        # Fetch data from the studentReport table
        cursor.execute('''
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
                sr.student_id = ur.id
            WHERE 
                sr.student_id = ?;  
        ''', (id,))  # Pass id as a parameter

        rows = cursor.fetchall()

        # Get column names from the cursor description
        column_names = [description[0] for description in cursor.description]

        # Format rows as a list of dictionaries
        data = [dict(zip(column_names, row)) for row in rows]

        cursor.close()  # Close the cursor properly
        conn.close()  # Close the connection properly

        # Return the data as JSON
        return json.dumps(data, indent=4)


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

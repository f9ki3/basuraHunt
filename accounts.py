from database import Database
import json
import random
import string

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
                        profile TEXT NULL,
                        year TEXT NULL,
                        strand TEXT NULL,
                        section TEXT NULL,
                        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status INTEGER NOT NULL
                    )''')
        conn.commit()
        print("Table Account Created!")
        conn.close()

    def insertAccounts(self, student_no, email, password, fname, lname, year, strand, section, contact=None, address=None, profile=None, status=None):
        conn = self.conn
        cursor = conn.cursor()
        
        try:
            # Check if the email already exists
            cursor.execute('''
                SELECT COUNT(*) FROM users WHERE email = ?
            ''', (email,))
            
            email_exists = cursor.fetchone()[0] > 0
            
            if email_exists:
                return 0  # Email already exists
            else:
                # Insert the new record
                cursor.execute('''
                    INSERT INTO users (student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status))
                conn.commit()  # Commit the changes
                return 1  # Insertion successful
            
        except Exception as e:
            conn.rollback()  # Rollback in case of error
            return f"An error occurred: {str(e)}"
        
        finally:
            cursor.close()
            # conn.close() - Uncomment if managing connection closure here.
    
    def updateStudent(self, student_no, id=None, email=None, fname=None, lname=None, year=None, strand=None, section=None, contact=None, address=None, profile=None, status=None):
        conn = self.conn
        cursor = conn.cursor()
        
        try:
            # Check if the student exists with the given student_no and optionally id
            cursor.execute('''
                SELECT COUNT(*) FROM users WHERE student_no = ? AND (? IS NULL OR id = ?)
            ''', (student_no, id, id))
            
            student_exists = cursor.fetchone()[0] > 0
            
            if not student_exists:
                return 0  # Student not found

            # Prepare the update statement and parameters
            update_fields = []
            params = []

            if email is not None:
                update_fields.append("email = ?")
                params.append(email)

            if fname is not None:
                update_fields.append("fname = ?")
                params.append(fname)

            if lname is not None:
                update_fields.append("lname = ?")
                params.append(lname)

            if year is not None:
                update_fields.append("year = ?")
                params.append(year)

            if strand is not None:
                update_fields.append("strand = ?")
                params.append(strand)

            if section is not None:
                update_fields.append("section = ?")
                params.append(section)

            if contact is not None:
                update_fields.append("contact = ?")
                params.append(contact)

            if address is not None:
                update_fields.append("address = ?")
                params.append(address)

            if profile is not None:
                update_fields.append("profile = ?")
                params.append(profile)

            if status is not None:
                update_fields.append("status = ?")
                params.append(status)

            # If there are no fields to update
            if not update_fields:
                return 2  # No fields provided for update

            # Add student_no to the parameters for the WHERE clause
            params.append(student_no)
            
            # If id is provided, we add it to the parameters
            if id is not None:
                params.append(id)
            
            # Build the update query
            update_query = f'''
                UPDATE users
                SET {', '.join(update_fields)}
                WHERE student_no = ? AND (? IS NULL OR id = ?)
            '''
            
            # Execute the update statement with the correct parameters
            cursor.execute(update_query, params + [id] if id is not None else params)
            conn.commit()  # Commit the changes
            return 1  # Update successful
            
        except Exception as e:
            conn.rollback()  # Rollback in case of error
            return f"An error occurred: {str(e)}"
            
        finally:
            cursor.close()
            # conn.close() - Uncomment if managing connection closure here.

    def updateAdmin(self, id, fname=None, lname=None, email=None, contact=None, address=None, status=None):
        conn = self.conn
        cursor = conn.cursor()
        
        try:
            # Check if the admin exists with the given id
            cursor.execute('''
                SELECT COUNT(*) FROM users WHERE id = ?
            ''', (id,))
            
            admin_exists = cursor.fetchone()[0] > 0
            
            if not admin_exists:
                return 0  # Admin not found

            # Prepare the update statement and parameters
            update_fields = []
            params = []

            if email is not None:
                update_fields.append("email = ?")
                params.append(email)

            if fname is not None:
                update_fields.append("fname = ?")
                params.append(fname)

            if lname is not None:
                update_fields.append("lname = ?")
                params.append(lname)

            if contact is not None:
                update_fields.append("contact = ?")
                params.append(contact)

            if address is not None:
                update_fields.append("address = ?")
                params.append(address)

            if status is not None:
                update_fields.append("status = ?")
                params.append(status)

            # If there are no fields to update
            if not update_fields:
                return 2  # No fields provided for update

            # Build the update query
            update_query = f'''
                UPDATE users
                SET {', '.join(update_fields)}
                WHERE id = ?
            '''
            
            # Execute the update statement
            cursor.execute(update_query, params + [id])  # Add id to the parameters
            conn.commit()  # Commit the changes
            return 1  # Update successful
            
        except Exception as e:
            conn.rollback()  # Rollback in case of error
            return f"An error occurred: {str(e)}"
            
        finally:
            cursor.close()
            # conn.close() - Uncomment if managing connection closure here.

    
    def deleteAccount(self, account_id):
        conn = self.conn
        cursor = conn.cursor()
        
        try:
            # Check if the account exists
            cursor.execute('''
                SELECT COUNT(*) FROM users WHERE id = ?
            ''', (account_id,))
            
            account_exists = cursor.fetchone()[0] > 0
            
            if not account_exists:
                return 0  # Account does not exist
            
            # Delete the account
            cursor.execute('''
                DELETE FROM users WHERE id = ?
            ''', (account_id,))
            
            conn.commit()
            return 1  # Account deleted successfully
            
        except Exception as e:
            conn.rollback()  # Rollback in case of error
            return f"An error occurred: {str(e)}"
        
        finally:
            cursor.close()
            # conn.close() - Uncomment if managing connection closure here.

    def generate_password(self, length=8):
        """Generate a random password with letters and digits."""
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(length))

    def insertAccountsFromGoogle(self, email, fname, lname, student_no=None, password=None, year=None, strand=None, section=None, contact=None, address=None, profile=None, status=None):
        conn = self.conn
        cursor = conn.cursor()

        try:
            # Ensure that email, first name, and last name are not empty
            if not email or not fname or not lname:
                return "Email, first name, and last name are required."
            
            # Check if the email already exists
            cursor.execute('''
                SELECT COUNT(*) FROM users WHERE email = ?
            ''', (email,))
            
            email_exists = cursor.fetchone()[0] > 0
            
            if email_exists:
                # If email exists, check if the password matches
                cursor.execute('''
                    SELECT password FROM users WHERE email = ?
                ''', (email,))
                stored_password = cursor.fetchone()[0]
                
                if stored_password == stored_password:
                    # Call the log_account method if the password matches
                    self.log_account(email, stored_password)
                    return {email,stored_password}
                else:
                    return "Incorrect password."
            else:
                # If password is None, generate a new password
                if not password:
                    password = self.generate_password()  # Generate a random password
                
                # Set default values for optional fields that are None
                student_no = student_no or None
                year = year or None
                strand = strand or None
                section = section or None
                contact = contact or None
                address = address or None
                profile = profile or 'profile.png'
                status = status or 1  # Default to 0 (inactive) if not provided

                # If email does not exist, insert the new record with optional fields
                cursor.execute('''
                    INSERT INTO users (student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status))
                conn.commit()  # Commit the changes
                
                self.log_account(email, password)
                
                # Return the status and success message
                return {email,password}

        except Exception as e:
            # Handle any exceptions that occur during the process
            return f"An error occurred: {e}"

    def log_account(self, email, password):
        conn = self.conn
        cursor = conn.cursor()
        
        try:
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
                    return 1  # Active
                elif status == 0:
                    return 0  # Inactive
            else:
                return 2  # No matching account
        
        finally:
            cursor.close()
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
            cursor.close()
            conn.close()  # Ensure the connection is closed properly
        
        # Return the data as JSON
        return json.dumps(data, indent=4)
    
    def getAccountOne(self, id):
        conn = self.conn
        cursor = conn.cursor()

        try:
            # Fetch data from the users table for the specific user with the given id
            cursor.execute('SELECT * FROM users WHERE id = ?', (id,))  # Use WHERE clause with the id
            row = cursor.fetchone()

            if row:
                # Get column names from the cursor description
                column_names = [description[0] for description in cursor.description]

                # Format the row as a dictionary
                data = dict(zip(column_names, row))
            else:
                # If no user found, return None or an empty dictionary
                data = None

        finally:
            cursor.close()
            conn.close()  # Ensure the connection is closed properly

        # Return the data as JSON
        return json.dumps(data, indent=4) if data else json.dumps({"message": "User not found"}, indent=4)

if __name__ == "__main__":
    result = Accounts().insertAccountsFromGoogle('sample@gmail.com','firstname','lname')
    print(result)
#     Accounts().createTableAccounts()
#     insert_result = Accounts().insertAccounts(
#         student_no="00000",
#         email="admin",
#         password="admin",
#         fname="Juan",
#         lname="Dela Cruz",
#         year=None,
#         strand=None,
#         section=None,
#         contact=None,
#         address=None,
#         profile="profile.png",
#         status=0
#     )

#     if insert_result == 1:
#         print("User inserted successfully!")
#     elif insert_result == 0:
#         print("Email already exists.")
#     else:
#         print(f"Error: {insert_result}")
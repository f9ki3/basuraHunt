from database import Database
import datetime

class Notification(Database):

    def createCountNotification(self):
        conn = self.conn  # Get connection from the parent class
        cursor = conn.cursor()  # Create the cursor
        
        try:
            cursor.execute('''CREATE TABLE IF NOT EXISTS countNotif (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        acc_id INTEGER NULL,
                        count INTEGER NULL
                    )''')
            conn.commit()
            print("Table 'countNotif' Created!")
        
        except Exception as e:
            print(f"An error occurred: {e}")
        
        finally:
            cursor.close()  # Ensure the cursor is closed

    def insertCountNotification(self, acc_id):
        conn = self.conn  # Get connection from the parent class
        count = 1
        cursor = conn.cursor()  # Create the cursor
        try:
            cursor.execute('''
                INSERT INTO countNotif (acc_id, count)
                VALUES (?, ?)
            ''', (acc_id, count))
            conn.commit()
            print("Notification count inserted successfully!")
        
        except Exception as e:
            print(f"An error occurred: {e}")
        
        finally:
            cursor.close()  # Ensure the cursor is closed

    def createNotificationHistory(self):
        """Create the notification history table if it doesn't exist"""
        conn = self.conn  # Get connection from the parent class
        cursor = conn.cursor()  # Create the cursor

        try:
            cursor.execute('''CREATE TABLE IF NOT EXISTS notificationHistory (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        acc_id INTEGER NOT NULL,
                        type TEXT NOT NULL,
                        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                    )''')
            conn.commit()
            print("Table 'notificationHistory' Created!")
        
        except Exception as e:
            print(f"An error occurred: {e}")
        
        finally:
            cursor.close()  # Ensure the cursor is closed

    def insertNotificationHistory(self, acc_id, notif_type):
        """Insert a new record into the notification history table with local time"""
        conn = self.conn  # Get connection from the parent class
        cursor = conn.cursor()  # Create the cursor
        
        # Get the current local time
        local_time = datetime.datetime.now()

        try:
            cursor.execute('''
                INSERT INTO notificationHistory (acc_id, type, date)
                VALUES (?, ?, ?)
            ''', (acc_id, notif_type, local_time))
            conn.commit()
            print(f"Notification history inserted for account {acc_id} with type '{notif_type}' at {local_time}")
        
        except Exception as e:
            print(f"An error occurred: {e}")
        
        finally:
            cursor.close()  # Ensure the cursor is closed

    def countAdminNotif(self, acc_id=None):
        conn = self.conn  # Get connection from the parent class
        cursor = conn.cursor()  # Create the cursor
        
        try:
            # Base query to count all rows
            query = 'SELECT SUM(count) FROM countNotif'
            
            # If acc_id is provided, add a WHERE clause
            if acc_id is not None:
                query += ' WHERE acc_id = ?'
            
            # Execute the count query
            cursor.execute(query, (acc_id,) if acc_id is not None else ())
            
            # Fetch the result
            result = cursor.fetchone()
            
            # Return the count (the first element in the result tuple)
            return result[0] if result else 0
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return 0  # Return 0 in case of an error
        
        finally:
            cursor.close()  # Ensure the cursor is closed



        

    def getAllNotificationHistory(self):
        conn = self.conn  # Get connection from the parent class
        cursor = conn.cursor()  # Create the cursor
        try:
            cursor.execute('''
            SELECT n.id, n.acc_id, n.type, n.date, u.fname, u.lname
            FROM notificationHistory n
            JOIN users u ON u.id = n.acc_id
            ORDER BY n.date DESC;

            ''')
            rows = cursor.fetchall()

            if rows:
                # Get column names from cursor.description
                columns = [description[0] for description in cursor.description]
                
                # Convert rows to list of dictionaries
                notification_history = []
                for row in rows:
                    row_dict = dict(zip(columns, row))
                    notification_history.append(row_dict)

                # Return the list of dictionaries
                return notification_history
            else:
                print("No records found in notification history.")
                return []

        except Exception as e:
            print(f"An error occurred: {e}")
            return []

        finally:
            cursor.close()  # Ensure the cursor is closed
    
    def clearNotificationMethod(self):
        conn = self.conn  # Get connection from the parent class
        cursor = conn.cursor()  # Create the cursor
        
        try:
            # Correct SQL query to update the count in the countNotif table
            cursor.execute('''
                UPDATE countNotif
                SET count = 0
            ''')
            # Commit the transaction
            conn.commit()
        
        except Exception as e:
            # Handle the exception (optional logging or re-raise)
            print(f"Error occurred: {e}")
            conn.rollback()  # Rollback in case of error
        
        finally:
            # Close the cursor to avoid memory leaks
            cursor.close()



if __name__ == "__main__":
    # Creating notification and history tables
    notification = Notification()
    notification.createCountNotification()
    notification.createNotificationHistory()
    
    # Inserting some sample notification history records
    notification.insertCountNotification(101)
    notification.insertNotificationHistory(101, "Account 101 Report Submitted")
    notification.insertNotificationHistory(102, "Account 102 Report Pending")

    # Retrieving all notification history records
    notification.getAllNotificationHistory()

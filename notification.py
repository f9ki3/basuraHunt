from database import Database

class Notification(Database):
    def createCountNotification(self):
        conn = self.conn  # Get connection from the parent class
        
        # Create the table if it doesn't exist
        cursor = conn.cursor()  # Create the cursor
        
        try:
            cursor.execute('''CREATE TABLE IF NOT EXISTS countNotif (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        acc_id INTEGER NULL,
                        count INTEGER NULL
                    )''')
            conn.commit()
            print("Table 'countNotif' Created!")
        
        finally:
            cursor.close()  # Ensure the cursor is closed
            conn.close()    # Ensure the connection is closed

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
            conn.close()    # Ensure the connection is closed

    def sumAndCountByAccId(self, acc_id):
        conn = self.conn  # Get connection from the parent class
        
        cursor = conn.cursor()  # Create the cursor
        try:
            cursor.execute('''
                SELECT SUM(count) AS total_count
                FROM countNotif
                WHERE acc_id = ?
            ''', (acc_id,))
            
            result = cursor.fetchone()  # Fetch the first row of the result
            total_count = result[0] if result and result[0] is not None else 0  # Handle case where SUM is None
            
            # Return a dictionary with sum and count
            return {
                "total_count": total_count
            }
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return {
                "total_count": 0,
                "error": str(e)
            }  # Return a dict with default values in case of error
        
        finally:
            cursor.close()  # Ensure the cursor is closed
            conn.close()    # Ensure the connection is closed


if __name__ == "__main__":
    Notification().createCountNotification()

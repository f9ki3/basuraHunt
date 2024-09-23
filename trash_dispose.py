from database import Database
from datetime import datetime

class TrashDispose(Database):
    def createTableTrashDispose(self):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS trashDispose (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              date TEXT NOT NULL,
                              dispose INTEGER
                              );
        ''')
        conn.commit()

    def insertTrashDispose(self, date, dispose):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO trashDispose (date, dispose)
        VALUES (?, ?);
        ''', (date, dispose))
        conn.commit()

    def getDisposeCount(self):
        conn = self.conn
        cursor = conn.cursor()
        today_date = datetime.now().strftime('%Y-%m-%d')  # Get today's date in 'YYYY-MM-DD' format
        cursor.execute('''
        SELECT SUM(dispose) FROM trashDispose WHERE date LIKE ?
        ''', (today_date + '%',))  # Use LIKE to match any time on that date
        result = cursor.fetchone()
        return result[0] if result and result[0] is not None else 0  # Return 0 if no disposals for today

# if __name__ == "__main__":
#     # Create table
#     TrashDispose().createTableTrashDispose()
    
#     # Insert a record
#     TrashDispose

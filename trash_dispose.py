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
                              dispose INTEGER,
                              bintype INTEGER
                              );
        ''')
        conn.commit()

    def insertTrashDispose(self, date, dispose, bin_type):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO trashDispose (date, dispose, bintype)
        VALUES (?, ?, ?);
        ''', (date, dispose, bin_type))
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
    
    def getDisposeCountDashboard(self):
        conn = self.conn
        cursor = conn.cursor()

        # SQL query to fetch the sum of disposals for 'Trash Bin 1' (bintype as text) for the last 10 days
        cursor.execute("""
            SELECT date(date), SUM(dispose) AS total_dispose
            FROM trashDispose
            WHERE bintype = 'Trash Bin 1'  -- Filter for 'Trash Bin 1'
            GROUP BY date(date)  -- Group by day (date only)
            ORDER BY date(date) DESC
            LIMIT 10
        """)

        # Fetch results for Trash Bin 1
        rows_bin1 = cursor.fetchall()

        # Initialize bin1 with date and value as empty lists
        bin1 = {
            'date': [],
            'value': []
        }

        # Process each row and populate bin1
        for row in rows_bin1:
            date = row[0]
            total_dispose = row[1]
            bin1['date'].append(date)
            bin1['value'].append(total_dispose)

        # SQL query to fetch the sum of disposals for 'Trash Bin 2'
        cursor.execute("""
            SELECT date(date), SUM(dispose) AS total_dispose
            FROM trashDispose
            WHERE bintype = 'Trash Bin 2'  -- Filter for 'Trash Bin 2'
            GROUP BY date(date)  -- Group by day (date only)
            ORDER BY date(date) DESC
            LIMIT 10
        """)

        # Fetch results for Trash Bin 2
        rows_bin2 = cursor.fetchall()

        # Initialize bin2 with date and value as empty lists
        bin2 = {
            'date': [],
            'value': []
        }

        # Process each row and populate bin2
        for row in rows_bin2:
            date = row[0]
            total_dispose = row[1]
            bin2['date'].append(date)
            bin2['value'].append(total_dispose)

        return {
            'bin1': bin1,
            'bin2': bin2
        }



    def getDisposeCount2(self):
        conn = self.conn
        cursor = conn.cursor()
        today_date = datetime.now().strftime('%Y-%m-%d')  # Get today's date in 'YYYY-MM-DD' format
        cursor.execute('''
        SELECT SUM(dispose) FROM trashDispose WHERE date LIKE ? AND bintype = "Trash Bin 2"
        ''', (today_date + '%',))  # Use LIKE to match any time on that date
        result = cursor.fetchone()
        return result[0] if result and result[0] is not None else 0  # Return 0 if no disposals for today
    
    def getDisposeCount1(self):
        conn = self.conn
        cursor = conn.cursor()
        today_date = datetime.now().strftime('%Y-%m-%d')  # Get today's date in 'YYYY-MM-DD' format
        cursor.execute('''
        SELECT SUM(dispose) FROM trashDispose WHERE date LIKE ? AND bintype = "Trash Bin 1"
        ''', (today_date + '%',))  # Use LIKE to match any time on that date
        result = cursor.fetchone()
        return result[0] if result and result[0] is not None else 0  # Return 0 if no disposals for today
    
    
    def getDisposeALL(self):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM trashDispose')
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        result = [dict(zip(column_names, row)) for row in rows]
        return result

if __name__ == "__main__":
    # Create table
    TrashDispose().createTableTrashDispose()


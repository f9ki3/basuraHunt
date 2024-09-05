import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('trash.db')
    
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
        conn.cursor().execute(f'''
        UPDATE trashCount SET count = {count} WHERE id = 1;
    ''')
        conn.commit()
        # print("Trash Count Updated!")
        conn.close()
    
    # We encounter error snce we forget to remove the count parameter
    def getTrashCount(self):
        conn = self.conn
        data = conn.cursor().execute(f'''
        SELECT count FROM trashCount WHERE id = 1;
    ''').fetchone()
        print(f"Retrieved id = {data} Count!")
        conn.close()
        return data
    

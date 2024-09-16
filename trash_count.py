from database import Database

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
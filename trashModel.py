import sqlite3

class Trash:
    def __init__(self):
        self.conn = sqlite3.connect('basurahunt.db')
    
    def tableTrashLogs(self):
        conn = self.conn
        conn.cursor().execute('''
        CREATE TABLE IF NOT EXISTS trashLogs(
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              date TEXT NOT NULL,
                              message TEXT NOT NULL,
                              percent INTEGER NOT NULL
                              )
        ''')
        conn.commit()
        # lets make a logs if success!
        # print('Table Logs Created!')
        conn.close()
    
    def tableTrashContent(self):
        conn = self.conn
        conn.cursor().execute('''
        CREATE TABLE IF NOT EXISTS trashCount(
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              count INTEGER NOT NULL
                              )
        ''')
        conn.commit()
        # lets make a logs if success!
        # print('Table Count Created!')
        conn.close()
    
    def updateTrashContent(self, count):
        conn = self.conn
        conn.cursor().execute(f'''
        UPDATE trashCount SET count = {count} WHERE id = 1
        ''',)
        conn.commit()
        # lets make a logs if success!
        print('Table Count Updated!')
        conn.close()
    
    def getTrashContent(self):
        conn = self.conn
        data = conn.cursor().execute('''
        SELECT count FROM trashCount WHERE id = 1
        ''',).fetchone()
        # lets make a logs if success!
        # print('Table Count Retrieved!')
        conn.close()
        return data

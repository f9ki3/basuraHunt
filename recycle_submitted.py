from database import Database

class RecycleSubmitted(Database):
    def create_recycle_submitted_table(self):
        # Using 'with' to ensure the connection and cursor are properly managed
        with self.conn:
            cursor = self.conn.cursor()

            # Create the table if it doesn't exist, adding a new column for recycle_id
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS recycle_submitted (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    recycle_id INTEGER NOT NULL UNIQUE,  -- New column for recycle_id
                    recycle_type TEXT NOT NULL,
                    grade_level TEXT NOT NULL,
                    strand TEXT NOT NULL,
                    section TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    status TEXT NOT NULL DEFAULT 'pending',
                    acc_id INTEGER NOT NULL,
                    FOREIGN KEY (acc_id) REFERENCES accounts(id)
                )
            ''')
            print("Table recycle_submitted created with recycle_id!")

    def insert_record(self, recycle_id, recycle_type, grade_level, strand, section, quantity, status, acc_id):
        # Using 'with' to ensure the connection and cursor are properly managed
        with self.conn:
            cursor = self.conn.cursor()

            # Insert a new record into the recycle_submitted table, including recycle_id
            cursor.execute('''
                INSERT INTO recycle_submitted (recycle_id, recycle_type, grade_level, strand, section, quantity, status, acc_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (recycle_id, recycle_type, grade_level, strand, section, quantity, status, acc_id))

            print("Record inserted into recycle_submitted table with recycle_id!")

    def get_all_recycle_submitted(self):
        # Retrieve all records from the recycle_submitted table and return as a list of dictionaries
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM recycle_submitted')
            columns = [col[0] for col in cursor.description]
            records = cursor.fetchall()

            # Convert each row into a dictionary
            result = [dict(zip(columns, record)) for record in records]
            return result

# if __name__ == "__main__":
#     # Assuming you have initialized your database connection properly
#     recycle_db = RecycleSubmitted()

#     # Create the table with the new column
#     recycle_db.create_recycle_submitted_table()

#     # Insert a record into the table, with a specific recycle_id
#     recycle_db.insert_record(101, 'Plastic', 'Grade 10', 'STEM', 'A', 50, 'pending', 1)

#     # Retrieve and print all records
#     records = recycle_db.get_all_recycle_submitted()
#     print(records)

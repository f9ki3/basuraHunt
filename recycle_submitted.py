from database import Database

class RecycleSubmitted(Database):
    def create_recycle_submitted_table(self):
        # Using 'with' to ensure the connection and cursor are properly managed
        with self.conn:
            cursor = self.conn.cursor()

            # Create the table if it doesn't exist
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS recycle_submitted (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            print("Table recycle_submitted created!")

    def insert_record(self, recycle_type, grade_level, strand, section, quantity, status, acc_id):
        # Using 'with' to ensure the connection and cursor are properly managed
        with self.conn:
            cursor = self.conn.cursor()

            # Insert a new record into the recycle_submitted table
            cursor.execute('''
                INSERT INTO recycle_submitted (recycle_type, grade_level, strand, section, quantity, status, acc_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (recycle_type, grade_level, strand, section, quantity, status, acc_id))

            print("Record inserted into recycle_submitted table!")

if __name__ == "__main__":
    # Assuming you have initialized your database connection properly
    recycle_db = RecycleSubmitted()

    # Create the table
    recycle_db.create_recycle_submitted_table()

    # Insert a record into the table
    recycle_db.insert_record('Plastic', 'Grade 10', 'STEM', 'A', 50, 'pending', 1)

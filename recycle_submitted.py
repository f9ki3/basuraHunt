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
            cursor.execute('SELECT * FROM recycle_submitted ORDER BY id DESC')
            columns = [col[0] for col in cursor.description]
            records = cursor.fetchall()

            # Convert each row into a dictionary
            result = [dict(zip(columns, record)) for record in records]
            return result
    
    def update_recieve(self, id, points, section):
        sections =  [
            "11 GAS A", "11 GAS B", "11 GAS C", "11 GAS D",
            "11 STEM A", "11 STEM B", "11 STEM C", "11 STEM D",
            "11 ICT A", "11 ICT B", "11 ICT C", "11 ICT D",
            "11 ABM A", "11 ABM B", "11 ABM C", "11 ABM D",
            "11 HUMSS A", "11 HUMSS B", "11 HUMSS C", "11 HUMSS D",
            "11 HE A", "11 HE B", "11 HE C", "11 HE D",
            "11 ALS A", "11 ALS B", "11 ALS C", "11 ALS D",
            "11 SMAW A", "11 SMAW B", "11 SMAW C", "11 SMAW D",
            "12 GAS A", "12 GAS B", "12 GAS C", "12 GAS D",
            "12 STEM A", "12 STEM B", "12 STEM C", "12 STEM D",
            "12 ICT A", "12 ICT B", "12 ICT C", "12 ICT D",
            "12 ABM A", "12 ABM B", "12 ABM C", "12 ABM D",
            "12 HUMSS A", "12 HUMSS B", "12 HUMSS C", "12 HUMSS D",
            "12 HE A", "12 HE B", "12 HE C", "12 HE D",
            "12 ALS A", "12 ALS B", "12 ALS C", "12 ALS D",
            "12 SMAW A", "12 SMAW B", "12 SMAW C", "12 SMAW D"
        ]

        if section not in sections:
            print("Invalid section")
            return  # Stop the function if the section is not valid

        # Ensure the SQL query is correct and avoid SQL injection
        with self.conn:
            cursor = self.conn.cursor()
            
            # Update the recycle_submitted table to mark the item as 'Received'
            cursor.execute('UPDATE recycle_submitted SET status = ? WHERE id = ?', ('Receive', id))
            
            # Fetch the current points for the given section
            cursor.execute('SELECT points FROM recycle_rewards WHERE section = ?', (section,))
            result = cursor.fetchone()
            
            if result:
                current_points = result[0]  # Extract the points from the query result
                new_points = current_points + points
                
                # Update the recycle_rewards table with the new points
                cursor.execute('UPDATE recycle_rewards SET points = ? WHERE section = ?', (new_points, section))
            
            self.conn.commit()  # Commit the transaction if the update is successful


    
    def get_all_recycle_points(self):
        # Retrieve all records from the recycle_submitted table and return as a list of dictionaries
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM recycle_rewards ORDER BY points DESC;')
            columns = [col[0] for col in cursor.description]
            records = cursor.fetchall()

            # Convert each row into a dictionary
            result = [dict(zip(columns, record)) for record in records]
            return result
    
    def get_all_recycle_points_students(self):
        """
        Retrieve all records from the recycle_rewards table and return as a JSON object
        with 'sections' and 'points' stored as separate lists.
        """
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute('SELECT section, points FROM recycle_rewards;')  # Fetch only 'section' and 'points'
            records = cursor.fetchall()

            # Separate sections and points into two lists
            sections = [record[0] for record in records]  # First column: section
            points = [record[1] for record in records]    # Second column: points

            # Return JSON-like dictionary
            return {"sections": sections, "points": points}


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

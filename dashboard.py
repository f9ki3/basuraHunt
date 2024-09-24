from datetime import datetime
from database import Database

class Dashboard(Database):
    def getDashboard(self):
        conn = self.conn
        cursor = conn.cursor()

        try:
            # Fetch the count of admins
            admin = cursor.execute('''
                SELECT COUNT(status) FROM users WHERE status = 0;
            ''').fetchone()

            # Fetch the count of students
            student = cursor.execute('''
                SELECT COUNT(status) FROM users WHERE status = 1;
            ''').fetchone()

            # Get the current date (only the date part) in the same format as in the database
            today_date = datetime.now().strftime('%Y-%m-%d')

            # Fetch today's disposals (filter by date portion of the datetime text field)
            todayDispose = cursor.execute('''
                SELECT COUNT(dispose) FROM trashDispose WHERE substr(date, 1, 10) = ?;
            ''', (today_date,)).fetchone()

            # Fetch total disposals
            totalDispose = cursor.execute('''
                SELECT COUNT(dispose) FROM trashDispose;
            ''').fetchone()

            print("Get Dashboard Created!")

            # Return the results
            return {
                "admin_count": admin[0],  # Fetch count from tuple
                "student_count": student[0],  # Fetch count from tuple
                "today_dispose_count": todayDispose[0],  # Today's disposals count
                "total_dispose_count": totalDispose[0]  # Total disposals count
            }

        except Exception as e:
            print(f"Error fetching dashboard data: {e}")
            return None
        
        finally:
            # Ensure the connection is closed properly
            conn.close()

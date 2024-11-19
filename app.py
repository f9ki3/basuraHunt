from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_socketio import SocketIO, emit
from authlib.integrations.flask_client import OAuth
import os, threading
from datetime import datetime
from database import *
from accounts import *
from trash_count import *
from trash_logs import *
from student_report import *
from trash_dispose import *
from dashboard import *
from notification import *

app = Flask(__name__)
socketio = SocketIO(app)
# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = 'basurahunt12345*'
app.secret_key = os.urandom(24)
app.config['GOOGLE_CLIENT_ID'] = '323113079361-ig181jaikulgfuluofqqet9o5lhfvmqg.apps.googleusercontent.com'
app.config['GOOGLE_CLIENT_SECRET'] = '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'

# Global variables
data_requested = False
current_trash_count = 0
reset_timer = None  # Timer object to track timeout
data_requested2 = False
current_trash_count2 = 0
reset_timer2 = None  # Timer object to track timeout

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=app.config['GOOGLE_CLIENT_ID'],
    client_secret=app.config['GOOGLE_CLIENT_SECRET'],
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    redirect_uri='http://127.0.0.1:5000/login/callback',
    client_kwargs={'scope': 'openid email profile'},
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs'
)

@app.route('/')
def index():
    status = session.get('status')
    if status == 0:
        return redirect('dashboard')
    if status == 1:
        return redirect('/home')
    return render_template('Auth.html')

@app.route('/success_create')
def success_create():
    return render_template('success_create.html')

@app.route('/log_account', methods=['POST'])
def loginAccount():
    # Ensure the request contains JSON data
    if request.is_json:
        data = request.get_json()  # Use get_json() to parse JSON
        p = data.get('log_email')
        e = data.get('log_password')
        
        data = Accounts().log_account(p,e)
        session_data = StudentReport().get_session(p,e)
        # print(session_data)
        if data == 1:
            session['status'] = data
            # session['email'] = p 
            session['session_data'] = session_data  # Store the session data
        elif data == 0:
            session['status'] = data
            # session['email'] = p 
            session['session_data'] = session_data  # Store the session data

        # Optionally, you can perform additional processing here

        # For debugging purposes, return the received data
        return jsonify({"data": data})
    else:
        return jsonify({"error": "Invalid request format"}), 400

@app.route('/login')
def login():
    # Generate a nonce and store it in the session
    session['nonce'] = os.urandom(16).hex()

    # Pass the nonce in the authorization request
    redirect_uri = url_for('authorized', _external=True)
    return google.authorize_redirect(redirect_uri, nonce=session['nonce'])

@app.route('/login/callback')
def authorized():
    token = google.authorize_access_token()

    try:
        # Retrieve the nonce from the session
        nonce = session.pop('nonce', None)
        if not nonce:
            return 'Error: Nonce missing from session'

        # Validate the ID token and check the nonce
        user_info = google.parse_id_token(token, nonce=nonce)

        if user_info:
            # Get email, first name, and surname from the token
            email = user_info.get('email')
            first_name = user_info.get('given_name')
            surname = user_info.get('family_name')
            
            result = Accounts().insertAccountsFromGoogle(email, first_name, surname, student_no=None, password=None, year=None, strand=None, section=None, contact=None, address=None, profile=None, status=None)
            email, passw = result
            print(result)
            data = 1
            session_data = StudentReport().get_session(email,passw)
            # print(session_data)
            if data == 1:
                session['status'] = data
                # session['email'] = p 
                session['session_data'] = session_data  # Store the session data
            elif data == 0:
                session['status'] = data
                # session['email'] = p 
                session['session_data'] = session_data  # Store the session data
            
            # Display the user information
            return redirect('/')

    except Exception as e:
        return f'Login failed: {str(e)}'

    return 'Login failed!'

# Admnastrator
@app.route('/dashboard')
def dashboard():
    status = session.get('status')
    if status == 0:
        return render_template('dashboard.html')
    else:
        return redirect('/')

@app.route('/waste_level')
def waste_level():
    status = session.get('status')
    if status == 0:
        return render_template('waste_level.html')
    else:
        return redirect('/')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/student_records')
def student_records():
    status = session.get('status')
    if status == 0:
        return render_template('student_record.html')
    else:
        return redirect('/')

@app.route('/student_reward')
def student_reward():
    status = session.get('status')
    if status == 0:
        return render_template('student_reward.html')
    else:
        return redirect('/')

@app.route('/account_manage')
def account_manage():
    status = session.get('status')
    if status == 0:
        return render_template('account_manage.html')
    else:
        return redirect('/')

@app.route('/disposal_sched')
def disposal_sched():
    status = session.get('status')
    if status == 0:
        return render_template('disposal_sched.html')
    else:
        return redirect('/')

# Students
@app.route('/home')
def home():
    status = session.get('status')
    if status == 1:
        StudentReport().createTableStudentReport()
        return render_template('home.html')
    else:
        return redirect('/')

@app.route('/profile')
def profile():
    status = session.get('status')
    if status == 1:
        return render_template('profile.html')
    else:
        return redirect('/')

@app.route('/recycle')
def recycle():
    status = session.get('status')
    if status == 1:
        return render_template('recycle.html')
    else:
        return redirect('/')

@app.route('/report')
def report():
    status = session.get('status')
    if status == 1:
        return redirect('/home')
    else:
        return redirect('/')

@app.route('/settings')
def settings():
    status = session.get('status')
    if status == 1:
        StudentReport().createTableStudentReport()
        return render_template('settings.html')
    else:
        return redirect('/')

@app.route('/waste_level_user')
def waste_level_user():
    status = session.get('status')
    if status == 1:
        return render_template('waste_level_user.html')
    else:
        return redirect('/')


# Create API that gets and retrieves data from the model
@app.route('/createAccountManual', methods=['POST'])
def create_account_manual():
    # Extract data from the request
    data = request.json  # Assuming you're sending JSON data

    # Extracting fields from the incoming data
    email = data.get('email')
    student_no = data.get('student_id')
    password = data.get('password')
    fname = data.get('fname')  # Extracting first name
    lname = data.get('lname')  # Extracting last name
    contact = data.get('contact')  # Extracting contact number
    year = data.get('grade')      # Extracting grade
    strand = data.get('strand')    # Extracting strand
    section = data.get('section')  # Extracting section
    address = None
    profile = 'profile.png'
    status = 1
    # Validate the data
    if not all([email, student_no, password, fname, lname, contact, year, strand, section]):
        return jsonify({'status': 'error', 'message': 'All fields are required.'}), 400

    # Insert the data into the database
    account_data = Accounts().insertAccounts( student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status)

    # Prepare a response
    if account_data == 0:
        return jsonify({'status': 'error', 'message': 'Email already exists.'}), 409
    elif isinstance(account_data, str):  # Check if an error message is returned
        return jsonify({'status': 'error', 'message': account_data}), 500

    response = {
        'data': account_data,
        'message': 'Account created successfully.',
        'status': 'success'  # You can add a status key for clarity
    }

    print(response)  # Optional: log the response

    return jsonify(response)  # Return JSON response



@app.route('/getCount', methods=['GET'])
def getCount():
    return jsonify(current_trash_count)  # Return the current trash count


@app.route('/updateCount', methods=['POST'])
def update_count():
    total = request.form.get('total')
    TrashCount().updateTrashCount(total)

    response = {
        'status': 'success',
        'total_received': total
    }

    return jsonify(response)

@app.route('/getCount2', methods=['GET'])
def getCount2():
    data = TrashCount().getTrashCount2()
    return jsonify(data)

@app.route('/updateCount2', methods=['POST'])
def update_count2():
    total = request.form.get('total')
    TrashCount().updateTrashCount2(total)

    response = {
        'status': 'success',
        'total_received': total
    }

    return jsonify(response)

# Route to receive data
# Function to reset the status of the microcontroller to 'off'
def reset_data_requested():
    global data_requested, data_requested2
    print("Microcontroller has not sent data recently. Marking it as 'off'.")
    data_requested = False
    data_requested2 = False

# Route to receive data from the microcontroller
# Route to receive data from the first microcontroller
@app.route('/data', methods=['POST'])
def receive_data():
    global current_trash_count, data_requested, reset_timer

    # Cancel the previous reset timer
    if reset_timer:
        reset_timer.cancel()

    # Mark data_requested as True (microcontroller is "on")
    data_requested = True
    print("Data received from microcontroller.")
    
    # Start a new timer to reset the flag after 30 seconds if no new data is received
    reset_timer = threading.Timer(30.0, reset_data_requested)  # Timeout of 30 seconds
    reset_timer.start()

    data = request.json
    if data is None or 'distance' not in data:
        current_trash_count = 404
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    distance = int(data.get('distance', 0))
    current_trash_count = distance  # Update the global variable with new data
    
    # Broadcast the updated trash count via WebSocket
    socketio.emit('updateTrash', {'count': current_trash_count})
    
    print(f"Distance: {distance}")  # Log the distance received

    return jsonify({
        "status": "success",
        "distance": distance
    }), 200

# Route to receive data from the second microcontroller
@app.route('/data2', methods=['POST'])
def receive_data2():
    global current_trash_count2, data_requested2, reset_timer2

    # Cancel the previous reset timer
    if reset_timer2:
        reset_timer2.cancel()

    # Mark data_requested2 as True (microcontroller is "on")
    data_requested2 = True
    print("Data received from second microcontroller.")
    
    # Start a new timer to reset the flag after 30 seconds if no new data is received
    reset_timer2 = threading.Timer(30.0, reset_data_requested)  # Timeout of 30 seconds
    reset_timer2.start()

    data = request.json
    if data is None or 'distance' not in data:
        current_trash_count2 = 404
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    distance = int(data.get('distance', 0))
    current_trash_count2 = distance  # Update the global variable with new data
    
    # Broadcast the updated trash count via WebSocket
    socketio.emit('updateTrash2', {'count': current_trash_count2})
    
    print(f"Distance: {distance}")  # Log the distance received

    return jsonify({
        "status": "success",
        "distance": distance
    }), 200

# Route to check if the first microcontroller is currently sending data
@app.route('/check_status', methods=['GET'])
def check_status():
    if data_requested:
        return jsonify({"status": "on", "message": "Microcontroller is on and sending data."}), 200
    else:
        return jsonify({"status": "off", "message": "Microcontroller is off or not sending data."}), 200

# Route to check if the second microcontroller is currently sending data
@app.route('/check_status2', methods=['GET'])
def check_status2():
    if data_requested2:
        return jsonify({"status": "on", "message": "Second microcontroller is on and sending data."}), 200
    else:
        return jsonify({"status": "off", "message": "Second microcontroller is off or not sending data."}), 200

# Configure the upload folder and allowed extensions for both images and videos
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to check if the file has an allowed extension (images and videos)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/insertReport', methods=['POST'])
def insertReport():
    # Get the description, strand, and section from the form data
    desc = request.form.get('desc')
    strand = request.form.get('strand')
    section = request.form.get('section')

    # Check if the post request has the images part
    if 'files[]' not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist('files[]')  # Get all files from 'files[]'
    
    if len(files) == 0:
        return jsonify({"error": "No selected files"}), 400

    saved_files = []  # List to store successfully saved file names

    for file in files:
        # If no file is selected or the file name is empty
        if file.filename == '':
            return jsonify({"error": "One of the selected files has no filename"}), 400

        # Check if the file has an allowed extension and save it
        if file and allowed_file(file.filename):
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            # Save the file to the upload folder
            file.save(file_path)
            saved_files.append(filename)
        else:
            return jsonify({"error": f"File '{file.filename}' type not allowed. Only JPG, PNG, MP4, MOV, and AVI are accepted."}), 400

    # Implode (join) all filenames into a single string, separated by commas
    files_string = ','.join(saved_files)

    # Process your form data (desc, strand, and section) here
    student_id = json.loads(session.get('session_data', '{}')).get('id')

    # Insert the report with the form data (strand and section)
    StudentReport().insertStudentReport(student_id, desc, files_string, strand, section)
    student_id = json.loads(session.get('session_data', '{}')).get('id')
    Notification().insertNotificationHistory(student_id, 'pending')
    Notification().insertCountNotification(student_id)

    return jsonify({
        "message": "Report inserted successfully",
        "desc": desc,
        "strand": strand,
        "section": section,
        "files": saved_files
    }), 200

@app.route('/getReport', methods=['GET'])
def getReport():
    data = StudentReport().getStudentReport()
    return jsonify(data)

@app.route('/getReportProfile', methods=['GET'])
def getReportProfile():
    session_data = session.get('session_data')
    data = json.loads(session_data)
    id = data['id']
    # print(id)
    data = StudentReport().getStudentReportProfile(id)
    return jsonify(data)

@app.route('/getSession', methods=['GET'])
def getSession():
    session_data = session.get('session_data')
    data = json.loads(session_data)
    id = data['id']
    dats = Accounts().getAccountOne(id)
    return jsonify(dats)

@app.route('/delete_report', methods=['POST'])
def delete_report():
    report_id = request.json.get('id')  # Get 'id' from the JSON request
    if report_id:
        StudentReport().deleteReport(report_id)
        student_id = json.loads(session.get('session_data', '{}')).get('id')
        Notification().insertNotificationHistory(student_id, 'deleted')
        Notification().insertCountNotification(student_id)
        return jsonify({"message": "Report deleted successfully", "status": "success"}), 200
    else:
        return jsonify({"message": "Report ID not provided", "status": "error"}), 400

@app.route('/edit_report', methods=['POST'])
def edit_report():
    report_id = request.form.get('id')  # Get the report ID
    report_desc = request.form.get('desc')  # Get the updated description
    report_media = request.files.get('med')  # Get the media file if it exists

    # Your logic to update the description in the database goes here
    # Example: Update the description of the report in the database
    # update_report_in_db(report_id, report_desc)

    # Check if a new media file was uploaded
    if report_media:
        # Define the path to save the media file (you can customize the path as needed)
        media_filename = report_media.filename
        media_path = os.path.join('static/uploads', media_filename)
        
        # Save the file to the defined path
        report_media.save(media_path)
        
        StudentReport().updateStudentReport(report_id, report_desc, media_filename)
    else:
        StudentReport().updateStudentReportMedia(report_id, report_desc)
    
    # Respond with a success message
    return jsonify({'message': 'Report successfully updated'}), 200

@app.route('/update_report_status', methods=['POST'])
def update_report_status():
    try:
        # Get data from the POST request (assuming it's sent as JSON)
        data = request.get_json()

        report_id = data.get('report_id')
        status = data.get('status')

        # Ensure both `report_id` and `status` are provided
        if not report_id or status is None:
            return jsonify({"success": False, "error": "Missing report ID or status"}), 400

        # Logic to update the report status in the database (example)
        # Assuming you have a function or ORM query to update the status:
        StudentReport().updateStudentReportStatusResponding(report_id, status) 

        # Example: Assume the update is successful
        # Replace this with actual database logic
        update_success = True  # Change based on your actual logic

        student_id = json.loads(session.get('session_data', '{}')).get('id')
        
        if update_success:
            Notification().insertNotificationHistory(student_id, 'responding')
            Notification().insertCountNotification(student_id)
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Failed to update report status"}), 500

    except Exception as e:
        # Log the exception (optional)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/update_report_status_resolve', methods=['POST'])
def update_report_status_resolve():
    try:
        # Get data from the POST request (assuming it's sent as JSON)
        data = request.get_json()

        report_id = data.get('report_id')
        status = data.get('status')

        # Ensure both `report_id` and `status` are provided
        if not report_id or status is None:
            return jsonify({"success": False, "error": "Missing report ID or status"}), 400

        # Logic to update the report status in the database (example)
        # Assuming you have a function or ORM query to update the status:
        StudentReport().updateStudentReportStatusResponding(report_id, status) 

        student_id = json.loads(session.get('session_data', '{}')).get('id')
        if status == 3:
            Notification().insertNotificationHistory(student_id, 'declined')
            Notification().insertCountNotification(student_id)
        elif status == 2:
            Notification().insertNotificationHistory(student_id, 'resolved')
            Notification().insertCountNotification(student_id)
        # Example: Assume the update is successful
        # Replace this with actual database logic
        update_success = True  # Change based on your actual logic

        if update_success:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Failed to update report status"}), 500

    except Exception as e:
        # Log the exception (optional)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/accounts', methods=['GET'])
def get_accounts():
    data = Accounts().getAccounts()  # Call the method to get accounts
    return jsonify(json.loads(data))  # Convert JSON string to a Python object and return as JSON response

@app.route('/process_trash1', methods=['POST'])
def process_trash():
    data = request.get_json()  # Get JSON data from the request
    dispose_value = data.get('dispose')  # Extract the 'dispose' value
    
    # Get the current date and time
    current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Format as a string

    type = 'Trash Bin 1'

    # Insert into the database (you would define this function)
    TrashDispose().insertTrashDispose(current_date, dispose_value, type)

    # Return a response
    return jsonify({"status": "success", "dispose": dispose_value, "date": current_date})

@app.route('/process_trash2', methods=['POST'])
def process_trash2():
    data = request.get_json()  # Get JSON data from the request
    dispose_value = data.get('dispose')  # Extract the 'dispose' value
    
    # Get the current date and time
    current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Format as a string

    type = 'Trash Bin 2'

    # Insert into the database (you would define this function)
    TrashDispose().insertTrashDispose(current_date, dispose_value, type)

    # Return a response
    return jsonify({"status": "success", "dispose": dispose_value, "date": current_date})

#Route to get the total of dispose
@app.route('/get_dispose2', methods=['GET'])
def getDisposeCount2():
    data = TrashDispose().getDisposeCount2()
    return jsonify({'response': data})

@app.route('/get_dispose1', methods=['GET'])
def getDisposeCount1():
    data = TrashDispose().getDisposeCount1()
    return jsonify({'response': data})

@app.route('/get_dispose_all', methods=['GET'])
def getDisposeAll():
    data = TrashDispose().getDisposeALL()
    return jsonify(data)

@app.route('/get_dashboard', methods=['GET'])
def get_dashboard():
    data = Dashboard().getDashboard()
    return jsonify(data)

@app.route('/create_student', methods=['POST'])
def create_student():
    # Get the JSON data from the request
    data = request.get_json()

    # Extract student information
    year = data.get('grade')
    strand = data.get('strand')
    section = data.get('section')
    student_no = data.get('student_id')
    fname = data.get('first_name')
    lname = data.get('last_name')
    email = data.get('email')
    contact = data.get('contact')
    address = data.get('address')
    password = data.get('password')
    profile = 'profile.png'
    status = 1

    # Here you would typically save the student data to a database
    status = Accounts().insertAccounts(student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status)
    if status == 1:
        return jsonify({'message': 'Student created successfully'}), 201
    # Respond with a success message
    return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/create_admin', methods=['POST'])
def create_admin():
    # Get the JSON data from the request
    data = request.get_json()

    # Extract admin information from the request
    fname = data.get('first_name')
    lname = data.get('last_name')
    email = data.get('email')
    contact = data.get('contact')
    address = data.get('address')
    password = data.get('password')
    student_no = None
    year = None
    strand = None
    section = None
    profile = 'profile.png'
    status = 0
    
    status = Accounts().insertAccounts(student_no, email, password, fname, lname, year, strand, section, contact, address, profile, status)

    if status == 1:
        return jsonify({'message': 'Student created successfully'}), 201
    # Respond with a success message
    return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/delete_account/<int:id>', methods=['DELETE'])
def delete_account(id):
    status = Accounts().deleteAccount(id)
    if status == 1:
        return jsonify({'message': 'Student created successfully'}), 201
    # Respond with a success message
    return jsonify({'message': 'Internal Server Error'}), 500
    
@app.route('/edit_account', methods=['POST'])
def edit_account():
    data = request.get_json()
    ed_id = data.get('ed_id')  # Retrieve the ed_id from the request
    
    data = Accounts().getAccountOne(ed_id)
    # print(data)

    return jsonify(data)

@app.route('/update_student', methods=['POST'])
def update_student():
    data = request.get_json()

    # Extract data from the request
    id = data.get('id')
    student_no = data.get('student_no')
    email = data.get('email')
    fname = data.get('fname')
    lname = data.get('lname')
    year = data.get('year')
    strand = data.get('strand')
    section = data.get('section')
    contact = data.get('contact')
    address = data.get('address')
    profile = 'profile.png'
    status = 1

    data = Accounts().updateStudent(student_no, id, email, fname, lname, year, strand, section, contact, address, profile, status)
    return jsonify(data)

@app.route('/update_admin', methods=['POST'])
def update_admin():
    # Get JSON data from the request
    data = request.get_json()

    # Extract data
    id = data.get('id')
    fname = data.get('fname')
    lname = data.get('lname')
    email = data.get('email')
    contact = data.get('contact')
    address = data.get('address')

    data = Accounts().updateAdmin( id, fname, lname, email, contact, address, status=0)

    return jsonify(data)

@app.route('/getDisposeDashboardsAnalytics', methods=['GET'])
def getDisposeCountDashboard():
    data = TrashDispose().getDisposeCountDashboard()
    return jsonify(data)

@app.route('/getNotifHistory', methods=['GET'])
def getNotifHistory():
    data = Notification().getAllNotificationHistory()
    return jsonify(data)

@app.route('/getNotifHistoryStudent', methods=['GET'])
def getNotifHistoryStudent():
    student_id = json.loads(session.get('session_data', '{}')).get('id')
    # print(student_id)
    data = Notification().getAllNotificationHistoryStudent(student_id)
    return jsonify(data)

@app.route('/getCountNotifAdmin', methods=['GET'])
def getCountNotifAdmin():
    data = Notification().countAdminNotif()
    return jsonify({'count':data})

@app.route('/getCountNotifStudent', methods=['GET'])
def getCountNotifStudent():
    student_id = json.loads(session.get('session_data', '{}')).get('id')
    data = Notification().countAdminNotif(student_id)
    return jsonify({'count':data})

@app.route('/clear_notifications', methods=['GET'])
def clear_notifications():
    Notification().clearNotificationMethod()
    return jsonify(1)

@app.route('/clear_notifications_student', methods=['GET'])
def clear_notifications_student():
    print('trigger')
    student_id = json.loads(session.get('session_data', '{}')).get('id')
    Notification().clearNotificationMethodStudent(student_id)
    return jsonify(1)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    socketio.run(app)
    # Database()
    # Accounts().createTableAccounts()
    # TrashLogs().createTableTrashLogs()
    # TrashCount().createTableTrashCount()

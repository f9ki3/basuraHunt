from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from authlib.integrations.flask_client import OAuth
import os
from datetime import datetime
from trashModel import *


app = Flask(__name__)

# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)
app.config['GOOGLE_CLIENT_ID'] = '323113079361-ig181jaikulgfuluofqqet9o5lhfvmqg.apps.googleusercontent.com'
app.config['GOOGLE_CLIENT_SECRET'] = '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'

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

@app.route('/login')
def login():
    # Generate a nonce and store it in the session
    session['nonce'] = os.urandom(16).hex()

    # Pass the nonce in the authorization request
    redirect_uri = url_for('authorized', _external=True)
    return google.authorize_redirect(redirect_uri, nonce=session['nonce'])

@app.route('/log_account', methods=['POST'])
def loginAccount():
    # Ensure the request contains JSON data
    if request.is_json:
        data = request.get_json()  # Use get_json() to parse JSON
        p = data.get('log_email')
        e = data.get('log_password')
        
        data = Accounts().log_account(p,e)
        session_data = StudentReport().get_session(p,e)
        print(session_data)
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
            # Get email, first name, surname, profile picture, and birthdate from the token
            email = user_info.get('email')
            first_name = user_info.get('given_name')
            surname = user_info.get('family_name')
            profile_picture = user_info.get('picture')

            # return (f'Logged in as: {first_name} {surname}, Email: {email}, '
            #         f'Profile Picture: <img src="{profile_picture}" alt="Profile Picture" />, ')
            return redirect('/student_records')
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

@app.route('/account_manage')
def account_manage():
    status = session.get('status')
    if status == 0:
        return render_template('account_manage.html')
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
    email = data.get('email')
    student_id = data.get('student_id')
    password = data.get('password')
    fname = data.get('fname')  # Extracting first name
    lname = data.get('lname')  # Extracting last name

    # Insert the data into the database (assuming insertAccounts now takes fname and lname)
    account_data = Accounts().insertAccounts(student_id, email, password, fname, lname)

    # Prepare a response
    response = {
        'status': 'success',
        'data': account_data
    }

    print(response)  # Optional: log the response

    return jsonify(response)  # Return JSON response

@app.route('/getCount', methods=['GET'])
def getCount():
    data = TrashCount().getTrashCount()
    return jsonify(data)

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

@app.route('/data', methods=['POST'])
def receive_data():
    # Get the distance from the request
    data = request.json
    distance = int(data.get('distance', 0))  
    TrashCount().updateTrashCount(distance)
    # Print the distance and percentage for debugging purposes
    print(f"Dstance: {distance}")

    # Return the distance and percentage as a JSON response
    return jsonify({
        "status": "success",
        "distance": distance
    }), 200


# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Check if the file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/insertReport', methods=['POST'])
def insertReport():
    # Get the description from the form data
    desc = request.form.get('desc')

    # Check if the post request has the file part
    if 'med' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['med']

    # If no file is selected
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Check if the file has an allowed extension and save it
    if file and allowed_file(file.filename):
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file to the upload folder
        file.save(file_path)
        student_id = json.loads(session.get('session_data', '{}')).get('id')
        # Process your form data (desc) here, e.g., save to a database
        StudentReport().insertStudentReport(student_id, desc, filename)

        return jsonify({
            "message": "Report inserted successfully",
            "desc": desc,
            "file": filename
        }), 200
    else:
        return jsonify({"error": "File type not allowed. Only JPG and PNG are accepted."}), 400

@app.route('/getReport', methods=['GET'])
def getReport():
    data = StudentReport().getStudentReport()
    return jsonify(data)

@app.route('/getSession', methods=['GET'])
def getSession():
    session_data = session.get('session_data')
    return jsonify(session_data)

@app.route('/delete_report', methods=['POST'])
def delete_report():
    report_id = request.json.get('id')  # Get 'id' from the JSON request
    if report_id:
        StudentReport().deleteReport(report_id)

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

        if update_success:
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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    # Database()
    # Accounts().createTableAccounts()
    # TrashLogs().createTableTrashLogs()
    # TrashCount().createTableTrashCount()

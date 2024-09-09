from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from authlib.integrations.flask_client import OAuth
import os
from datetime import datetime
from trashModel import *

app = Flask(__name__)


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

        if data == 1:
            session['status'] = data
            session['email'] = p 
        elif data == 0:
            session['status'] = data
            session['email'] = p 

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
            return redirect('/dashboard')
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
    return render_template('waste_level.html')

@app.route('/logout')
def logout():
    session.clear()
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

# Create API that gets and retrieves data from the model
@app.route('/createAccountManual', methods=['POST'])
def create_account_manual():
    # Extract data from the request
    data = request.json  # Assuming you're sending JSON data
    email = data.get('email')
    student_id = data.get('student_id')
    password = data.get('password')
    data = Accounts().insertAccounts(student_id, email, password)
    # Prepare a response (this is where you send a response back to the client)
    response = {
        'status': 'success',
        'data': data
    }
    print(response)
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


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    Database()
    Accounts().createTableAccounts()
    TrashLogs().createTableTrashLogs()
    TrashCount().createTableTrashCount()
    StudentReport().createTableStudentReport()

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
    return render_template('Auth.html')

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

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/waste_level')
def waste_level():
    return render_template('waste_level.html')

@app.route('/logout')
def logout():
    return redirect('/')

# Create API that gets and retrieves data from the model
@app.route('/createAccountManual', methods=['POST'])
def create_account_manual():
    # Extract data from the request
    data = request.json  # Assuming you're sending JSON data

    # Process the data (this is where you handle the business logic)
    # For example, you might save the data to a database here

    # Prepare a response (this is where you send a response back to the client)
    response = {
        'status': 'success',
        'message': 'Account created successfully',
        'data': data  # Echo back the received data or any other information
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
    data = request.json
    distance = data.get('distance')
    print(distance)
    # Save data to a database if needed
    return jsonify({"status": "success", "distance": distance}), 200



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    Database()
    Accounts().createTableAccounts()
    TrashLogs().createTableTrashLogs()
    TrashCount().createTableTrashCount()

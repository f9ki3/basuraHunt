from flask import Flask, render_template, request, jsonify
from trashModel import Trash

app = Flask(__name__)

# Route Section
@app.route('/')
def home():
    return render_template('index.html')

# API Section
@app.route('/trashLogs', methods=['POST'])
def trash_logs():
    data = request.json.get('data')
    print("Received data:", data)
    print(type(data))
    # Lets create for the method that update the current content of bin
    Trash().updateTrashContent(data)
    return jsonify(data)

@app.route('/trashCount', methods=['GET'])
def trash_count():
    count = Trash().getTrashContent()
    return jsonify(count)

if __name__ == "__main__":
    app.run(debug=True)
    Trash()
    Trash().tableTrashLogs()
    Trash().tableTrashContent()

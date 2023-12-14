from flask import Flask, jsonify
from api import RunPACMan

app = Flask(__name__)

@app.route('/api/public/run_pacman', methods=["GET", "POST"])
def about():
    print("api triggered")
    output, error = RunPACMan().run()
    return output




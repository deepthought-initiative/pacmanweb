from flask import Flask, jsonify
from api import RunPACMan

app = Flask(__name__)

@app.route('/api/public/run_pacman', methods=["GET", "POST"])
def about():
    pacman_proc = RunPACMan()
    output = pacman_proc.run()
    return output




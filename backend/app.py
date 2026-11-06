# AURA OS — Backend Python (Flask API & ESP32 Relay)
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

ESP32_IP = "192.168.1.105"  # Configuravel

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "online",
        "battery": 84,
        "temperature": 34.2,
        "esp32_ip": ESP32_IP
    })

@app.route('/api/command/move', methods=['POST'])
def send_move():
    data = request.json
    direction = data.get('direction')
    # Encaminha comando para o ESP32 via HTTP/REST
    try:
        # requests.get(f"http://{ESP32_IP}/move?dir={direction}", timeout=2)
        return jsonify({"status": "success", "command": direction})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/command/servo', methods=['POST'])
def send_servo():
    data = request.json
    servo_id = data.get('id')
    angle = data.get('angle')
    return jsonify({"status": "success", "servo": servo_id, "angle": angle})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

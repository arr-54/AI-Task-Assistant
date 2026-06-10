from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    text = data['text']
    priority, category = analyze(text)
    return jsonify({
        "priority": priority,
        "category": category
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
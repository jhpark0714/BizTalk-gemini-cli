import os
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
import groq

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app, setting the static folder to the 'frontend' directory
app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Initialize Groq client
# The API key is loaded automatically from the GROQ_API_KEY environment variable
try:
    groq_client = groq.Groq()
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    groq_client = None

# Route to serve the main index.html file
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/convert', methods=['POST'])
def convert_text():
    """
    Handles the text conversion request.
    For Sprint 1, this returns a dummy response.
    """
    data = request.get_json()
    if not data or 'text' not in data or 'target' not in data:
        return jsonify({'error': 'Invalid request. "text" and "target" fields are required.'}), 400

    original_text = data.get('text')
    target = data.get('target')

    # In a real scenario, we would use the groq_client to call the API
    # For now, we return a dummy response based on the target
    dummy_responses = {
        "상사": f"[상사 맞춤 더미 응답] 원문: {original_text}",
        "타팀 동료": f"[동료 맞춤 더미 응답] 원문: {original_text}",
        "고객": f"[고객 맞춤 더미 응답] 원문: {original_text}"
    }

    dummy_response = dummy_responses.get(target, f"[기본 더미 응답] 원문: {original_text}")

    return jsonify({
        'original_text': original_text,
        'converted_text': dummy_response
    })

@app.route('/health', methods=['GET'])
def health_check():
    """
    A simple health check endpoint.
    """
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # Runs the app in debug mode on port 5000
    app.run(debug=True, port=5000)

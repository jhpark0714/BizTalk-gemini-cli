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
    Handles the text conversion request using Groq AI.
    """
    if not groq_client:
        return jsonify({'error': 'Groq client is not initialized. Check API key.'}), 500

    data = request.get_json()
    if not data or 'text' not in data or 'target' not in data:
        return jsonify({'error': 'Invalid request. "text" and "target" fields are required.'}), 400

    original_text = data.get('text')
    target = data.get('target') # This will be '상사', '타팀 동료', '고객' from the frontend

    # Frontend sends Korean values, map them to English keys for prompts
    target_mapping = {
        "상사": "Upward",
        "타팀 동료": "Lateral",
        "고객": "External"
    }
    target_key = target_mapping.get(target)

    if not target_key:
        return jsonify({'error': f'Invalid target: {target}'}), 400

    # Prompt engineering based on the target
    prompts = {
        "Upward": "당신은 직장 상사에게 보고하기 위한 정중하고 전문적인 비즈니스 문서를 작성하는 AI 어시스턴트입니다. 다음 텍스트를 상사에게 보고하는 상황에 맞게, 결론부터 명확하게, 정중한 격식체로 수정해주세요.",
        "Lateral": "당신은 다른 팀의 동료에게 협업을 요청하기 위한 명확하고 친절한 비즈니스 이메일을 작성하는 AI 어시스턴트입니다. 다음 텍스트를 동료에게 업무 협조를 구하는 상황에 맞게, 요청사항과 배경을 명확히 전달하는 상호 존중적인 어투로 수정해주세요.",
        "External": "당신은 고객에게 보내는 공식적이고 신뢰감 있는 비즈니스 안내문을 작성하는 AI 어시스턴트입니다. 다음 텍스트를 고객에게 안내하는 상황에 맞게, 극존칭을 사용하고 전문성이 드러나는 정중한 어투로 수정해주세요."
    }

    system_prompt = prompts.get(target_key)

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": original_text,
                }
            ],
            model="moonshotai/kimi-k2-instruct-0905",
        )

        converted_text = chat_completion.choices[0].message.content

        return jsonify({
            'original_text': original_text,
            'converted_text': converted_text.strip()
        })

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Failed to communicate with AI service.'}), 503


@app.route('/health', methods=['GET'])
def health_check():
    """
    A simple health check endpoint.
    """
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # Runs the app in debug mode on port 5000
    app.run(debug=True, port=5000)

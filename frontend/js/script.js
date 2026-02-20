document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const convertBtn = document.getElementById('convertBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const feedbackContainer = document.getElementById('feedbackContainer');
    const errorMsg = document.getElementById('errorMsg');
    const feedbackBtns = document.querySelectorAll('.feedback-btn');

    const MAX_CHARS = 500;
    const API_URL = '/api/convert';

    // 1. Character count logic
    inputText.addEventListener('input', () => {
        const count = inputText.value.length;
        charCount.textContent = `${count}/${MAX_CHARS}`;
        
        // Visual warning if close to limit
        if (count >= MAX_CHARS) {
            charCount.classList.add('text-red-500');
        } else {
            charCount.classList.remove('text-red-500');
        }
    });

    // 2. Convert button click handler
    convertBtn.addEventListener('click', async () => {
        const textToConvert = inputText.value.trim();
        const selectedTargetInput = document.querySelector('input[name="target"]:checked');
        const selectedTarget = selectedTargetInput ? selectedTargetInput.value : '상사';

        if (!textToConvert) {
            showError('변환할 내용을 입력해주세요.');
            return;
        }

        // Set loading state
        setLoading(true);
        hideError();
        copyBtn.classList.add('hidden');
        feedbackContainer.classList.add('hidden');
        outputText.textContent = '';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textToConvert,
                    target: selectedTarget,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `서버 오류가 발생했습니다. (상태 코드: ${response.status})`);
            }

            const data = await response.json();
            
            // Success: Display result
            outputText.textContent = data.converted_text;
            copyBtn.classList.remove('hidden');
            feedbackContainer.classList.remove('hidden');

        } catch (error) {
            console.error('Conversion error:', error);
            showError(`오류가 발생했습니다: ${error.message}. 잠시 후 다시 시도해주세요.`);
        } finally {
            setLoading(false);
        }
    });

    // 3. Copy button click handler
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputText.textContent;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ 복사되었습니다!';
                copyBtn.classList.remove('bg-gray-100', 'text-gray-700');
                copyBtn.classList.add('bg-green-100', 'text-green-700');
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('bg-green-100', 'text-green-700');
                    copyBtn.classList.add('bg-gray-100', 'text-gray-700');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showError('복사에 실패했습니다. 직접 선택하여 복사해주세요.');
            });
    });

    // 4. Feedback button logic
    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            const emoji = type === 'good' ? '👍' : '👎';
            
            // Visual feedback
            alert(`피드백이 전달되었습니다. (${emoji}) 감사합니다!`);
            feedbackContainer.innerHTML = '<span class="text-sm text-blue-500 font-medium italic">피드백을 보내주셔서 감사합니다!</span>';
        });
    });

    // Helper: Set loading state
    function setLoading(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            loadingSpinner.style.display = 'block';
            btnText.style.display = 'none';
            convertBtn.classList.add('opacity-80', 'cursor-not-allowed');
        } else {
            convertBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            btnText.style.display = 'block';
            convertBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
    }

    // Helper: Show/Hide Error
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }

    function hideError() {
        errorMsg.textContent = '';
        errorMsg.classList.add('hidden');
    }
});

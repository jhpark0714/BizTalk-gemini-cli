document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const convertBtn = document.getElementById('convertBtn');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const feedback = document.getElementById('feedback');
    const spinner = convertBtn.querySelector('.spinner');
    const btnText = convertBtn.querySelector('span');

    const MAX_CHARS = 500;
    const API_URL = '/api/convert'; // API endpoint is now on the same origin

    // 1. Character count logic
    inputText.addEventListener('input', () => {
        const count = inputText.value.length;
        charCount.textContent = `${count}/${MAX_CHARS}`;
    });

    // 2. Convert button click handler
    convertBtn.addEventListener('click', async () => {
        const textToConvert = inputText.value;
        const selectedTarget = document.querySelector('input[name="target"]:checked').value;

        if (!textToConvert.trim()) {
            showFeedback('변환할 내용을 입력해주세요.', 'error');
            return;
        }

        // Set loading state
        setLoading(true);
        copyBtn.style.display = 'none';

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
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            outputText.textContent = data.converted_text;
            copyBtn.style.display = 'block';
            showFeedback(''); // Clear previous feedback

        } catch (error) {
            console.error('Error during conversion:', error);
            outputText.textContent = '';
            showFeedback(`오류가 발생했습니다: ${error.message}`, 'error');
        } finally {
            // Unset loading state
            setLoading(false);
        }
    });

    // 3. Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (!outputText.textContent) return;

        navigator.clipboard.writeText(outputText.textContent)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '복사되었습니다!';
                copyBtn.style.backgroundColor = '#4CAF50';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = ''; // Revert to default or specific color if needed
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showFeedback('복사에 실패했습니다. 다시 시도해주세요.', 'error');
            });
    });

    // Helper function to set loading state on the button
    function setLoading(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            spinner.style.display = 'block';
            btnText.style.display = 'none';
        } else {
            convertBtn.disabled = false;
            spinner.style.display = 'none';
            btnText.style.display = 'block';
        }
    }

    // Helper function to show feedback messages
    function showFeedback(message, type = 'info') {
        feedback.textContent = message;
        feedback.style.color = type === 'error' ? '#EF4444' : '#333333';
        feedback.style.display = message ? 'block' : 'none';
    }
});

import { useEffect, useRef } from 'react';

export const useTranscription = (isActive, userName, onNewCaption) => {
    const recognitionRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    useEffect(() => {
        if (!isActive) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            
            if (text.trim() && onNewCaption) {
                onNewCaption({
                    speaker: userName,
                    text: text.trim(),
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        };

        let hasError = false;

        recognition.onerror = (event) => {
            if (event.error !== 'aborted' && event.error !== 'no-speech') {
                console.warn("Speech recognition error:", event.error);
            }
            if (event.error === 'network' || event.error === 'aborted' || event.error === 'not-allowed') {
                hasError = true;
            }
        };

        recognition.onend = () => {
            // Auto-restart if still active, with delay if error occurred to prevent infinite loop
            if (isActive && recognitionRef.current) {
                const delay = hasError ? 3000 : 500;
                retryTimeoutRef.current = setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.error("Error restarting recognition", e);
                    }
                }, delay);
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Error starting recognition", e);
        }
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        };
    }, [isActive, userName, onNewCaption]);

    return {};
};

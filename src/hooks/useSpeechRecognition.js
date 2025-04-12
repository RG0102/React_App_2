import { useEffect, useRef } from "react";

export default function useSpeechRecognition(onCommand) {
  const commandCooldown = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      if (result.isFinal) {
        const transcript = result[0].transcript;
        console.log("You said:", transcript);
        if (!commandCooldown.current) {
          commandCooldown.current = true;
          onCommand(transcript.toLowerCase());
          setTimeout(() => {
            commandCooldown.current = false;
          }, 500); // 5-second cooldown before processing a new command
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Error during recognition:", event.error);
      // Restart recognition after a short delay when an error occurs
      setTimeout(() => {
        recognition.start();
      }, 200);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [onCommand]);
}

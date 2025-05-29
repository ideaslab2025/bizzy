
// Speech Recognition API type declarations
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

// Use interface merging to extend existing types if they exist
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Only declare if not already available
declare var SpeechRecognition: SpeechRecognitionConstructor;
declare var webkitSpeechRecognition: SpeechRecognitionConstructor;

export {};

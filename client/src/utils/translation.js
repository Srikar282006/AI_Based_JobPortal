// src/utils/translation.js

// Map visible language names → Google Translate language codes
export const languagesMap = {
  English: "en",
  Hindi: "hi",
  Telugu: "te",
  Tamil: "ta",
  Kannada: "kn"
};

// Core translation function (Google Translate Widget)
export function translatePageTo(langCode) {
  const googleCombo = document.querySelector("select.goog-te-combo");

  if (!googleCombo) {
    console.warn("Google Translate combo not found.");
    return;
  }

  googleCombo.value = langCode;

  // Dispatch change event to trigger translation
  googleCombo.dispatchEvent(new Event("change"));
}

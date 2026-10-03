function voiceScore(voice) {
  const name = (voice.name || "").toLowerCase()
  const preferred = ["siri", "premium", "enhanced", "lesya", "kateryna", "milena"]
  let score = 0
  preferred.forEach((key, index) => {
    if (name.includes(key)) score += 30 - index
  })
  if (name.includes("compact")) score -= 25
  if (voice.localService) score += 3
  return score
}

export function warmUpVoices() {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.getVoices()
}

export function speak(text) {
  if (!("speechSynthesis" in window)) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const voices = synth.getVoices()
  const ukrainian = voices
    .filter((voice) => (voice.lang || "").toLowerCase().startsWith("uk"))
    .sort((a, b) => voiceScore(b) - voiceScore(a))

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "uk-UA"
  utterance.rate = 0.82
  utterance.pitch = 1.06
  utterance.volume = 1
  if (ukrainian[0]) utterance.voice = ukrainian[0]
  synth.speak(utterance)
  return true
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel()
}

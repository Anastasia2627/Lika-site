import { useEffect, useMemo, useRef, useState } from "react"
import {
  colors,
  countSets,
  feeding,
  gameCards,
  gentleTry,
  listeningItems,
  praise,
  randomItem,
  shuffled,
  stickers
} from "./data.js"
import { speak, stopSpeaking, warmUpVoices } from "./voice.js"

function cx() {
  return Array.from(arguments).filter(Boolean).join(" ")
}

function Cat({ small = false, thinking = false }) {
  return (
    <div className={cx("cat-wrap", small && "cat-small")} aria-hidden="true">
      <svg className="cat-svg" viewBox="0 0 220 190">
        <defs>
          <linearGradient id="catBody" x1="0" x2="1">
            <stop offset="0" stopColor="#fbf8ff" />
            <stop offset="1" stopColor="#eee7ff" />
          </linearGradient>
        </defs>
        <path d="M45 66 L58 18 L91 48 Q110 39 131 48 L163 18 L176 68" fill="url(#catBody)" stroke="#6b4fd3" strokeWidth="8" strokeLinejoin="round"/>
        <path d="M59 28 L66 56 L84 48 Z" fill="#ff9fcf"/>
        <path d="M161 28 L154 57 L137 48 Z" fill="#ff9fcf"/>
        <rect x="38" y="45" width="145" height="118" rx="62" fill="url(#catBody)" stroke="#6b4fd3" strokeWidth="8"/>
        <ellipse cx="81" cy="95" rx="9" ry="12" fill="#47346f"/>
        <ellipse cx="140" cy="95" rx="9" ry="12" fill="#47346f"/>
        <circle cx="78" cy="91" r="3" fill="#fff"/>
        <circle cx="137" cy="91" r="3" fill="#fff"/>
        <path d="M104 109 Q110 115 116 109 Q110 103 104 109Z" fill="#ff82b8"/>
        {thinking ? (
          <path d="M96 127 Q110 117 124 127" fill="none" stroke="#47346f" strokeWidth="5" strokeLinecap="round"/>
        ) : (
          <>
            <path d="M110 115 Q96 132 86 118" fill="none" stroke="#47346f" strokeWidth="5" strokeLinecap="round"/>
            <path d="M110 115 Q124 132 134 118" fill="none" stroke="#47346f" strokeWidth="5" strokeLinecap="round"/>
          </>
        )}
        <ellipse cx="61" cy="119" rx="12" ry="7" fill="#ffb2d7" opacity=".65"/>
        <ellipse cx="159" cy="119" rx="12" ry="7" fill="#ffb2d7" opacity=".65"/>
        <path d="M52 104 L18 96 M53 115 L14 116 M57 126 L22 137" stroke="#6b4fd3" strokeWidth="4" strokeLinecap="round"/>
        <path d="M169 104 L203 96 M168 115 L207 116 M164 126 L199 137" stroke="#6b4fd3" strokeWidth="4" strokeLinecap="round"/>
        <path className="cat-paw" d="M157 148 Q190 129 199 148 Q204 164 182 174 Q165 181 151 163" fill="#f4efff" stroke="#6b4fd3" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

function TopBar({ stars, onHome, title }) {
  return (
    <header className="topbar">
      <button className="round-button" onClick={onHome} aria-label="На головну">⌂</button>
      <div className="top-title">{title}</div>
      <div className="star-pill"><span>⭐</span><strong>{stars}</strong></div>
    </header>
  )
}

function VoiceButton({ text }) {
  return (
    <button className="voice-button" onClick={() => speak(text)} aria-label="Повторити завдання">
      <span className="speaker">🔊</span>
      <span>ще раз</span>
    </button>
  )
}

function GameFrame({ title, stars, onHome, children }) {
  return (
    <main className="game-page">
      <TopBar stars={stars} onHome={onHome} title={title} />
      {children}
    </main>
  )
}

function StartGate({ prompt, onStart }) {
  return (
    <div className="start-gate">
      <Cat />
      <div className="speech-bubble">
        <strong>{prompt}</strong>
        <span>Натисни — і почнемо ✨</span>
      </div>
      <button className="primary-button start-button" onClick={onStart}>▶ Почати</button>
    </div>
  )
}

function RewardOverlay({ sticker, onContinue, onHome }) {
  useEffect(() => {
    speak("Ура! Ти отримала подаруночок!")
  }, [])

  return (
    <div className="reward-backdrop">
      <div className="reward-card">
        <div className="reward-rays" />
        <div className="gift-box">🎁</div>
        <h2>Подаруночок!</h2>
        <div className="sticker-prize">{sticker}</div>
        <p>Ти чудово пограла 💜</p>
        <div className="reward-actions">
          <button className="primary-button" onClick={onContinue}>Ще пограти</button>
          <button className="soft-button" onClick={onHome}>На головну</button>
        </div>
      </div>
    </div>
  )
}

function ProgressDots({ wins }) {
  return (
    <div className="progress-dots">
      {[0, 1, 2, 3, 4].map((n) => <i key={n} className={n < wins % 5 ? "filled" : ""} />)}
    </div>
  )
}

function ListenGame({ stars, addStar, onHome }) {
  const all = useMemo(() => listeningItems, [])
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [wins, setWins] = useState(0)
  const [reward, setReward] = useState(false)

  function buildRound() {
    const correct = randomItem(all)
    const wrong = randomItem(all.filter((item) => item.id !== correct.id))
    return { correct, options: shuffled([correct, wrong]) }
  }

  function announce(nextRound) {
    setTimeout(() => speak("Де " + nextRound.correct.label + "?"), 80)
  }

  function start() {
    const nextRound = buildRound()
    setRound(nextRound)
    setStarted(true)
    announce(nextRound)
  }

  function next() {
    const nextRound = buildRound()
    setRound(nextRound)
    setFeedback(null)
    announce(nextRound)
  }

  function choose(item) {
    if (!round || feedback === "correct") return
    if (item.id === round.correct.id) {
      setFeedback("correct")
      addStar()
      speak(randomItem(praise) + " Це " + round.correct.label + ".")
      const nextWins = wins + 1
      setWins(nextWins)
      if (nextWins % 5 === 0) setTimeout(() => setReward(true), 850)
      else setTimeout(next, 1150)
    } else {
      setFeedback(item.id)
      speak(randomItem(gentleTry))
      setTimeout(() => setFeedback(null), 700)
    }
  }

  return (
    <GameFrame title="Слухай" stars={stars} onHome={onHome}>
      {!started ? (
        <StartGate prompt="Я назву щось, а ти знайдеш картинку" onStart={start} />
      ) : round && (
        <div className="question-layout">
          <div className="helper-row">
            <Cat small thinking={feedback && feedback !== "correct"} />
            <div className="question-bubble">
              <div className="question-text">Де <strong>{round.correct.label}</strong>?</div>
              <VoiceButton text={"Де " + round.correct.label + "?"} />
            </div>
          </div>
          <div className="choice-grid two">
            {round.options.map((item) => (
              <button
                key={item.id}
                className={cx(
                  "picture-card",
                  feedback === "correct" && item.id === round.correct.id && "is-correct",
                  feedback === item.id && "is-wrong"
                )}
                onClick={() => choose(item)}
              >
                <span className={cx("big-emoji", item.number && "number-emoji")}>{item.emoji}</span>
              </button>
            ))}
          </div>
          <ProgressDots wins={wins} />
        </div>
      )}
      {reward && (
        <RewardOverlay
          sticker={randomItem(stickers)}
          onContinue={() => { setReward(false); next() }}
          onHome={onHome}
        />
      )}
    </GameFrame>
  )
}

function ColorsGame({ stars, addStar, onHome }) {
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [wins, setWins] = useState(0)
  const [reward, setReward] = useState(false)

  function buildRound() {
    const correct = randomItem(colors)
    const wrong = randomItem(colors.filter((item) => item.id !== correct.id))
    return { correct, options: shuffled([correct, wrong]) }
  }

  function announce(nextRound) {
    setTimeout(() => speak("Знайди " + nextRound.correct.label + " колір."), 80)
  }

  function start() {
    const nextRound = buildRound()
    setRound(nextRound)
    setStarted(true)
    announce(nextRound)
  }

  function next() {
    const nextRound = buildRound()
    setRound(nextRound)
    setFeedback(null)
    announce(nextRound)
  }

  function choose(item) {
    if (feedback === "correct") return
    if (item.id === round.correct.id) {
      setFeedback("correct")
      addStar()
      speak(randomItem(praise))
      const nextWins = wins + 1
      setWins(nextWins)
      if (nextWins % 5 === 0) setTimeout(() => setReward(true), 800)
      else setTimeout(next, 1050)
    } else {
      setFeedback(item.id)
      speak("Спробуй інший колір.")
      setTimeout(() => setFeedback(null), 650)
    }
  }

  return (
    <GameFrame title="Кольори" stars={stars} onHome={onHome}>
      {!started ? (
        <StartGate prompt="Шукай кольори разом зі мною" onStart={start} />
      ) : round && (
        <div className="question-layout">
          <div className="helper-row">
            <Cat small />
            <div className="question-bubble">
              <div className="question-text">Знайди <strong>{round.correct.label}</strong></div>
              <VoiceButton text={"Знайди " + round.correct.label + " колір."} />
            </div>
          </div>
          <div className="choice-grid two">
            {round.options.map((item) => (
              <button
                key={item.id}
                onClick={() => choose(item)}
                className={cx(
                  "picture-card",
                  "color-card",
                  feedback === "correct" && item.id === round.correct.id && "is-correct",
                  feedback === item.id && "is-wrong"
                )}
              >
                <span className="color-blob" style={{ "--blob": item.value }} />
              </button>
            ))}
          </div>
          <ProgressDots wins={wins} />
        </div>
      )}
      {reward && (
        <RewardOverlay
          sticker={randomItem(stickers)}
          onContinue={() => { setReward(false); next() }}
          onHome={onHome}
        />
      )}
    </GameFrame>
  )
}

function FeedGame({ stars, addStar, onHome }) {
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [wins, setWins] = useState(0)
  const [reward, setReward] = useState(false)

  function buildRound() {
    const item = randomItem(feeding)
    return { ...item, options: shuffled([item.correct, item.wrong]) }
  }

  function announce(nextRound) {
    setTimeout(() => speak(nextRound.animalName + " зголоднів. Що він любить їсти?"), 80)
  }

  function start() {
    const nextRound = buildRound()
    setRound(nextRound)
    setStarted(true)
    announce(nextRound)
  }

  function next() {
    const nextRound = buildRound()
    setRound(nextRound)
    setFeedback(null)
    announce(nextRound)
  }

  function choose(food) {
    if (feedback === "correct") return
    if (food === round.correct) {
      setFeedback("correct")
      addStar()
      speak("Так! " + round.animalName + " любить " + round.correctName + ".")
      const nextWins = wins + 1
      setWins(nextWins)
      if (nextWins % 5 === 0) setTimeout(() => setReward(true), 850)
      else setTimeout(next, 1200)
    } else {
      setFeedback(food)
      speak("Ой, це не його смаколик. Спробуй ще.")
      setTimeout(() => setFeedback(null), 700)
    }
  }

  return (
    <GameFrame title="Нагодуй" stars={stars} onHome={onHome}>
      {!started ? (
        <StartGate prompt="Наші звірята зголодніли" onStart={start} />
      ) : round && (
        <div className="feed-layout">
          <div className="animal-stage">
            <div className="animal-emoji">{round.animal}</div>
            <div className="tiny-bubble">ням-ням!</div>
          </div>
          <div className="question-bubble compact">
            <div className="question-text">Що любить <strong>{round.animalName}</strong>?</div>
            <VoiceButton text={round.animalName + " зголоднів. Що він любить їсти?"} />
          </div>
          <div className="choice-grid two foods">
            {round.options.map((food) => (
              <button
                key={food}
                className={cx(
                  "picture-card",
                  "food-card",
                  feedback === "correct" && food === round.correct && "is-correct",
                  feedback === food && "is-wrong"
                )}
                onClick={() => choose(food)}
              >
                <span className="big-emoji">{food}</span>
              </button>
            ))}
          </div>
          <ProgressDots wins={wins} />
        </div>
      )}
      {reward && (
        <RewardOverlay
          sticker={randomItem(stickers)}
          onContinue={() => { setReward(false); next() }}
          onHome={onHome}
        />
      )}
    </GameFrame>
  )
}

function CountGame({ stars, addStar, onHome }) {
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [wins, setWins] = useState(0)
  const [reward, setReward] = useState(false)

  function buildRound() {
    const item = randomItem(countSets)
    const alternatives = [1, 2, 3].filter((n) => n !== item.count)
    return { ...item, options: shuffled([item.count, randomItem(alternatives)]) }
  }

  function announce() {
    setTimeout(() => speak("Скільки тут? Порахуй."), 80)
  }

  function start() {
    setRound(buildRound())
    setStarted(true)
    announce()
  }

  function next() {
    setRound(buildRound())
    setFeedback(null)
    announce()
  }

  function choose(value) {
    if (feedback === "correct") return
    if (value === round.count) {
      setFeedback("correct")
      addStar()
      speak("Так! Тут " + value + ".")
      const nextWins = wins + 1
      setWins(nextWins)
      if (nextWins % 5 === 0) setTimeout(() => setReward(true), 850)
      else setTimeout(next, 1100)
    } else {
      setFeedback(value)
      speak("Давай порахуємо ще раз.")
      setTimeout(() => setFeedback(null), 700)
    }
  }

  return (
    <GameFrame title="Рахуємо" stars={stars} onHome={onHome}>
      {!started ? (
        <StartGate prompt="Порахуємо разом: один, два, три" onStart={start} />
      ) : round && (
        <div className="count-layout">
          <div className="question-bubble compact">
            <div className="question-text">Скільки тут?</div>
            <VoiceButton text="Скільки тут? Порахуй." />
          </div>
          <div className="count-stage">
            {Array.from({ length: round.count }).map((_, index) => <span key={index}>{round.emoji}</span>)}
          </div>
          <div className="choice-grid two number-choices">
            {round.options.map((value) => (
              <button
                key={value}
                onClick={() => choose(value)}
                className={cx(
                  "number-card",
                  feedback === "correct" && value === round.count && "is-correct",
                  feedback === value && "is-wrong"
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <ProgressDots wins={wins} />
        </div>
      )}
      {reward && (
        <RewardOverlay
          sticker={randomItem(stickers)}
          onContinue={() => { setReward(false); next() }}
          onHome={onHome}
        />
      )}
    </GameFrame>
  )
}

function makeMemoryBoard() {
  const choices = shuffled(["🐱", "🍓", "🌈", "🦋", "🐶", "⭐"]).slice(0, 2)
  const entries = [
    { id: "a1", emoji: choices[0] },
    { id: "a2", emoji: choices[0] },
    { id: "b1", emoji: choices[1] },
    { id: "b2", emoji: choices[1] }
  ]
  return shuffled(entries)
}

function MemoryGame({ stars, addStar, onHome }) {
  const [started, setStarted] = useState(false)
  const [cards, setCards] = useState(() => makeMemoryBoard())
  const [open, setOpen] = useState([])
  const [matched, setMatched] = useState([])
  const locked = useRef(false)

  function start() {
    setStarted(true)
    speak("Знайди дві однакові картинки.")
  }

  function flip(card) {
    if (locked.current || open.includes(card.id) || matched.includes(card.id)) return
    const nextOpen = [...open, card.id]
    setOpen(nextOpen)
    if (nextOpen.length !== 2) return

    locked.current = true
    const first = cards.find((item) => item.id === nextOpen[0])
    const second = cards.find((item) => item.id === nextOpen[1])

    if (first.emoji === second.emoji) {
      setTimeout(() => {
        setMatched((current) => [...current, first.id, second.id])
        setOpen([])
        addStar()
        speak("Є пара! Молодчинка!")
        locked.current = false
      }, 450)
    } else {
      setTimeout(() => {
        setOpen([])
        speak("Запам’ятай, де вони. Спробуй ще.")
        locked.current = false
      }, 850)
    }
  }

  useEffect(() => {
    if (!started || matched.length !== 4) return
    const timer = setTimeout(() => {
      speak("Ти знайшла всі пари!")
      setCards(makeMemoryBoard())
      setMatched([])
      setOpen([])
    }, 800)
    return () => clearTimeout(timer)
  }, [matched, started])

  return (
    <GameFrame title="Пари" stars={stars} onHome={onHome}>
      {!started ? (
        <StartGate prompt="Запам’ятовуй картинки та шукай пари" onStart={start} />
      ) : (
        <div className="memory-layout">
          <div className="helper-row mini">
            <Cat small />
            <div className="question-bubble">
              <div className="question-text">Знайди дві однакові</div>
              <VoiceButton text="Знайди дві однакові картинки." />
            </div>
          </div>
          <div className="memory-grid">
            {cards.map((card) => {
              const visible = open.includes(card.id) || matched.includes(card.id)
              return (
                <button
                  key={card.id}
                  className={cx("memory-card", visible && "open", matched.includes(card.id) && "matched")}
                  onClick={() => flip(card)}
                >
                  <span className="card-back">🐾</span>
                  <span className="card-front">{card.emoji}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </GameFrame>
  )
}

const notes = [
  { label: "До", freq: 261.63, className: "note-pink" },
  { label: "Ре", freq: 293.66, className: "note-orange" },
  { label: "Мі", freq: 329.63, className: "note-yellow" },
  { label: "Фа", freq: 349.23, className: "note-green" },
  { label: "Соль", freq: 392, className: "note-sky" },
  { label: "Ля", freq: 440, className: "note-blue" },
  { label: "Сі", freq: 493.88, className: "note-violet" }
]

let audioContext = null

function getAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  if (!audioContext) audioContext = new AudioCtx()
  if (audioContext.state === "suspended") audioContext.resume()
  return audioContext
}

function playTone(frequency, duration = 0.5) {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "sine"
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration + 0.04)
}

function playDrum() {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(150, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.25)
  gain.gain.setValueAtTime(0.38, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.34)
}

function MusicGame({ stars, onHome }) {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(null)

  function tap(note, index) {
    playTone(note.freq)
    setPlaying(index)
    setTimeout(() => setPlaying(null), 280)
  }

  return (
    <GameFrame title="Музика" stars={stars} onHome={onHome}>
      {!started ? (
        <StartGate
          prompt="Зіграємо свою веселу мелодію"
          onStart={() => {
            setStarted(true)
            speak("Торкайся кольорових клавіш і слухай музику.")
          }}
        />
      ) : (
        <div className="music-layout">
          <div className="music-sky">
            <span>✨</span><span>⭐</span><span>☁️</span><span>✨</span>
            <Cat small />
            <div className="music-title">Зіграй мелодію 🎵</div>
          </div>
          <div className="xylophone">
            {notes.map((note, index) => (
              <button
                key={note.label}
                className={cx("xylo-key", note.className, playing === index && "playing")}
                onPointerDown={() => tap(note, index)}
              >
                <span>{note.label}</span>
              </button>
            ))}
          </div>
          <button className="drum-button" onPointerDown={playDrum}><span>🥁</span><b>Бум!</b></button>
        </div>
      )}
    </GameFrame>
  )
}

function Home({ stars, openGame }) {
  return (
    <main className="home-page">
      <div className="decor decor-one">✦</div>
      <div className="decor decor-two">●</div>
      <div className="decor decor-three">★</div>

      <section className="home-hero">
        <div className="hero-copy">
          <div className="hello-pill">🐾 Наша гра</div>
          <h1>Привіт!</h1>
          <p>У що пограємо сьогодні?</p>
          <div className="home-stars">⭐ <strong>{stars}</strong> зірочок</div>
        </div>
        <div className="hero-cat">
          <Cat />
          <div className="hero-cloud">Обирай гру! 💜</div>
        </div>
      </section>

      <section className="game-grid">
        {gameCards.map((game) => (
          <button
            key={game.id}
            className={cx("game-tile", game.tone)}
            onClick={() => openGame(game.id)}
          >
            <span className="tile-sparkle">✦</span>
            <span className="tile-icon">{game.emoji}</span>
            <span className="tile-copy">
              <strong>{game.title}</strong>
              <small>{game.subtitle}</small>
            </span>
            <span className="tile-go">›</span>
          </button>
        ))}
      </section>

      <p className="home-footnote">Грай у своєму темпі 🌷</p>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState("home")
  const [stars, setStars] = useState(() => Number(localStorage.getItem("lika-stars") || 0))

  useEffect(() => {
    localStorage.setItem("lika-stars", String(stars))
  }, [stars])

  useEffect(() => {
    warmUpVoices()
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = warmUpVoices
    }
  }, [])

  function addStar() {
    setStars((current) => current + 1)
  }

  function home() {
    stopSpeaking()
    setView("home")
  }

  return (
    <div className="app-shell">
      {view === "home" && <Home stars={stars} openGame={setView} />}
      {view === "listen" && <ListenGame stars={stars} addStar={addStar} onHome={home} />}
      {view === "colors" && <ColorsGame stars={stars} addStar={addStar} onHome={home} />}
      {view === "feed" && <FeedGame stars={stars} addStar={addStar} onHome={home} />}
      {view === "count" && <CountGame stars={stars} addStar={addStar} onHome={home} />}
      {view === "memory" && <MemoryGame stars={stars} addStar={addStar} onHome={home} />}
      {view === "music" && <MusicGame stars={stars} onHome={home} />}
    </div>
  )
}

export const listeningItems = [
  { id: "cat", label: "котик", emoji: "🐱" },
  { id: "dog", label: "песик", emoji: "🐶" },
  { id: "rabbit", label: "зайчик", emoji: "🐰" },
  { id: "cow", label: "корівка", emoji: "🐮" },
  { id: "horse", label: "коник", emoji: "🐴" },
  { id: "duck", label: "качечка", emoji: "🦆" },
  { id: "frog", label: "жабка", emoji: "🐸" },
  { id: "bear", label: "ведмедик", emoji: "🐻" },
  { id: "apple", label: "яблуко", emoji: "🍎" },
  { id: "banana", label: "банан", emoji: "🍌" },
  { id: "pear", label: "груша", emoji: "🍐" },
  { id: "strawberry", label: "полуниця", emoji: "🍓" },
  { id: "carrot", label: "морква", emoji: "🥕" },
  { id: "watermelon", label: "кавун", emoji: "🍉" },
  { id: "bread", label: "хліб", emoji: "🍞" },
  { id: "cheese", label: "сир", emoji: "🧀" },
  { id: "one", label: "цифра один", emoji: "1", number: true },
  { id: "two", label: "цифра два", emoji: "2", number: true },
  { id: "three", label: "цифра три", emoji: "3", number: true }
]

export const colors = [
  { id: "red", label: "червоний", value: "#ff637f" },
  { id: "blue", label: "синій", value: "#63b8ff" },
  { id: "yellow", label: "жовтий", value: "#ffd85e" },
  { id: "green", label: "зелений", value: "#72d39b" },
  { id: "pink", label: "рожевий", value: "#ff8fc8" },
  { id: "purple", label: "фіолетовий", value: "#8a6bf6" }
]

export const feeding = [
  { animal: "🐰", animalName: "зайчик", correct: "🥕", correctName: "морквинку", wrong: "🍕" },
  { animal: "🐱", animalName: "котик", correct: "🐟", correctName: "рибку", wrong: "🍭" },
  { animal: "🐵", animalName: "мавпочка", correct: "🍌", correctName: "банан", wrong: "🧀" },
  { animal: "🐶", animalName: "песик", correct: "🦴", correctName: "кісточку", wrong: "🍋" }
]

export const countSets = [
  { count: 1, emoji: "🍓" },
  { count: 2, emoji: "🐥" },
  { count: 3, emoji: "⭐" },
  { count: 2, emoji: "🍎" },
  { count: 3, emoji: "🦋" },
  { count: 1, emoji: "🚗" }
]

export const gameCards = [
  { id: "listen", title: "Слухай", subtitle: "Обери картинку", emoji: "👂", tone: "violet" },
  { id: "colors", title: "Кольори", subtitle: "Знайди колір", emoji: "🌈", tone: "pink" },
  { id: "feed", title: "Нагодуй", subtitle: "Хто що їсть?", emoji: "🥕", tone: "sky" },
  { id: "count", title: "Рахуємо", subtitle: "Один, два, три", emoji: "🔢", tone: "yellow" },
  { id: "memory", title: "Пари", subtitle: "Знайди однакові", emoji: "🧩", tone: "mint" },
  { id: "music", title: "Музика", subtitle: "Грай мелодію", emoji: "🎵", tone: "lavender" }
]

export const praise = ["Так! Молодчинка!", "Чудово!", "Правильно!", "У тебе вийшло!", "Супер!"]
export const gentleTry = ["Спробуй ще раз", "Майже! Ще разочок", "Подумай ще трішки"]
export const stickers = ["🌟", "🦋", "🌸", "🍓", "🌈", "🐾", "💛", "🎈"]

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

export function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

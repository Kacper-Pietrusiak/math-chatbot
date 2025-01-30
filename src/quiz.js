const { generateMathTask } = require("./mathTasks");
const quizzes = {}; // Przechowuje aktywne quizy dla użytkowników

function startQuiz(chatId, bot, difficulty = "medium") {
  console.log(
    `🎯 Rozpoczynanie quizu dla użytkownika ${chatId} (Poziom: ${difficulty})`
  );

  quizzes[chatId] = {
    score: 0,
    totalQuestions: 3,
    currentQuestion: 0,
    difficulty,
    lastQuestion: null, // Ostatnie pytanie
    lastAnswer: null, // Poprawna odpowiedź
  };

  sendNextQuestion(chatId, bot);
}

function sendNextQuestion(chatId, bot) {
  if (!quizzes[chatId]) return;

  const quiz = quizzes[chatId];

  if (quiz.currentQuestion >= quiz.totalQuestions) {
    bot.sendMessage(
      chatId,
      `🏆 Koniec quizu! Twój wynik: ${quiz.score}/${quiz.totalQuestions}`
    );
    delete quizzes[chatId]; // Usunięcie quizu po zakończeniu
    return;
  }

  quiz.currentQuestion++;

  // **Generowanie nowego zadania**
  let question;
  let answer;

  while (true) {
    question = generateMathTask(quiz.difficulty);
    const parts = question.split("=");

    if (parts.length === 2) {
      try {
        answer = eval(parts[1].trim()); // Obliczenie poprawnej odpowiedzi
        if (!isNaN(answer)) break; // Przerwij pętlę, jeśli odpowiedź jest liczbą
      } catch (error) {
        console.error("❌ Błąd przetwarzania pytania, generujemy nowe.");
      }
    }
  }

  quiz.lastQuestion = question;
  quiz.lastAnswer = parseFloat(answer);

  console.log(`📩 Nowe pytanie ${quiz.currentQuestion}: ${question}`);
  bot.sendMessage(
    chatId,
    `❓ Pytanie ${quiz.currentQuestion}/${quiz.totalQuestions}:\n${question}`
  );
}

function checkAnswer(chatId, bot, answer) {
  if (!quizzes[chatId]) return;

  const quiz = quizzes[chatId];
  const userAnswer = parseFloat(answer);

  if (userAnswer === quiz.lastAnswer) {
    bot.sendMessage(chatId, "✅ Poprawna odpowiedź!");
    quiz.score++;
  } else {
    bot.sendMessage(
      chatId,
      `❌ Niepoprawna! Poprawna odpowiedź to: ${quiz.lastAnswer}`
    );
  }

  sendNextQuestion(chatId, bot);
}

module.exports = { startQuiz, checkAnswer };

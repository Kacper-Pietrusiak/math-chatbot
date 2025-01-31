const { generateMathTask, generateMathAnswer } = require("./mathTasks");

const activeQuizzes = new Map(); // Przechowuje quizy dla użytkowników

async function startQuiz(chatId, bot, level = "medium") {
  console.log(`🎯 Rozpoczynanie quizu dla chatId: ${chatId}, poziom: ${level}`);

  const quiz = {
    questions: [],
    answers: [],
    currentQuestion: 0,
    score: 0,
  };

  for (let i = 0; i < 3; i++) {
    const question = await generateMathTask(level, "word");
    const answer = await generateMathAnswer(question);

    if (question && answer) {
      quiz.questions.push(question);
      quiz.answers.push(answer);
    } else {
      console.error("❌ Nie udało się wygenerować pytania lub odpowiedzi!");
    }
  }

  activeQuizzes.set(chatId, quiz);
  askQuestion(chatId, bot);
}

function askQuestion(chatId, bot) {
  const quiz = activeQuizzes.get(chatId);

  if (!quiz || quiz.currentQuestion >= quiz.questions.length) {
    bot.sendMessage(chatId, `🏆 Koniec quizu! Twój wynik: ${quiz.score}/3`);
    activeQuizzes.delete(chatId);
    return;
  }

  const question = quiz.questions[quiz.currentQuestion];
  bot.sendMessage(
    chatId,
    `❓ Pytanie ${quiz.currentQuestion + 1}/3:\n${question}`
  );
}

async function checkAnswer(chatId, bot, userAnswer) {
  const quiz = activeQuizzes.get(chatId);

  if (!quiz || quiz.currentQuestion >= quiz.questions.length) {
    return;
  }

  const correctAnswer = quiz.answers[quiz.currentQuestion].trim();

  // **Sprawdzamy poprawność odpowiedzi**
  if (isAnswerCorrect(userAnswer, correctAnswer)) {
    quiz.score++;
    bot.sendMessage(chatId, "✅ Poprawna odpowiedź!");
  } else {
    bot.sendMessage(
      chatId,
      `❌ Niepoprawna! Prawidłowa odpowiedź to: ${correctAnswer}`
    );
  }

  quiz.currentQuestion++;
  askQuestion(chatId, bot);
}

/**
 * ✅ Funkcja sprawdzająca poprawność odpowiedzi (elastyczna analiza tekstu)
 */
function isAnswerCorrect(userAnswer, correctAnswer) {
  // Usuwamy białe znaki i zamieniamy na małe litery
  userAnswer = userAnswer.trim().toLowerCase();
  correctAnswer = correctAnswer.trim().toLowerCase();

  // 1️⃣ **Jeśli liczby się zgadzają, to uznajemy odpowiedź**
  const userNumber = userAnswer.match(/\d+/); // Znajduje liczbę w odpowiedzi użytkownika
  const correctNumber = correctAnswer.match(/\d+/); // Znajduje liczbę w poprawnej odpowiedzi

  if (userNumber && correctNumber && userNumber[0] === correctNumber[0]) {
    return true; // Jeśli liczby są takie same, uznajemy odpowiedź za poprawną
  }

  // 2️⃣ **Jeśli użytkownik podał liczbę i poprawne słowo kluczowe, akceptujemy**
  if (
    userAnswer.includes(correctNumber?.[0]) &&
    correctAnswer.split(" ").some((word) => userAnswer.includes(word))
  ) {
    return true;
  }

  return false; // W innym przypadku odpowiedź jest niepoprawna
}

module.exports = { startQuiz, checkAnswer };

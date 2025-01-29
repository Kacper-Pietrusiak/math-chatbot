function generateMathTask(level) {
  switch (level) {
    case "easy":
      return "What is 5 + 3?";
    case "medium":
      return "Solve: 2x + 3 = 7";
    case "hard":
      return "Integrate: ∫(2x^2 + 3x)dx";
    default:
      return "Choose a difficulty level: easy, medium, or hard.";
  }
}

module.exports = { generateMathTask };

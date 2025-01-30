const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { evaluate } = require("mathjs");
const fs = require("fs");
const path = require("path");

const width = 600;
const height = 400;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function plotFunction(expression, bot, chatId) {
  try {
    console.log(`📊 Generowanie wykresu dla funkcji: ${expression}`);

    const xValues = [];
    const yValues = [];

    for (let x = -10; x <= 10; x += 0.5) {
      xValues.push(x);
      try {
        let scope = { x };
        let y = evaluate(expression, scope);
        yValues.push(y);
      } catch (error) {
        console.error("❌ Błąd w obliczaniu wartości funkcji:", error);
        bot.sendMessage(
          chatId,
          "⚠️ Nie udało się przetworzyć funkcji. Upewnij się, że poprawnie ją zapisałeś, np. `plot x^2 + 2*x`."
        );
        return;
      }
    }

    const config = {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            label: `Wykres funkcji: ${expression}`,
            data: yValues,
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: { title: { display: true, text: "x" } },
          y: { title: { display: true, text: "y" } },
        },
      },
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
    const imagePath = path.join(__dirname, `temp_chart_${chatId}.png`);

    fs.writeFileSync(imagePath, imageBuffer);
    console.log("✅ Wykres zapisany jako:", imagePath);

    // Upewnij się, że plik został zapisany przed wysłaniem
    if (fs.existsSync(imagePath)) {
      console.log("📤 Wysyłanie wykresu do użytkownika...");
      await bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
        caption: `📊 Wykres funkcji: ${expression}`,
      });

      // Usunięcie pliku po wysłaniu
      setTimeout(() => fs.unlinkSync(imagePath), 5000);
    } else {
      console.error("❌ Plik obrazu nie istnieje, nie można go wysłać.");
      bot.sendMessage(chatId, "⚠️ Wystąpił problem z generowaniem wykresu.");
    }
  } catch (error) {
    console.error("❌ Błąd generowania wykresu:", error);
    bot.sendMessage(chatId, "⚠️ Wystąpił błąd podczas generowania wykresu.");
  }
}

module.exports = { plotFunction };

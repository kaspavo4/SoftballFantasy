import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    const url = "https://czechsoftball.wbsc.org/cs/events/extraliga-mu-2024/stats/general/all";
    
    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tbody tr");
      let results = [];

      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        const rowData = [];
        columns.forEach((col) => {
          rowData.push(col.innerText.trim());
        });
        results.push(rowData);
      });
      return results;
    });

    await browser.close();
    res.json({ status: "success", data });

  } catch (error) {
    console.error("Chyba Puppeteer:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na portu ${PORT}`);
});

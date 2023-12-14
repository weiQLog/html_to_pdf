const fs = require('fs');
const express = require('express');
const {generatePDFFromHTML} = require("./utils/genPdfFile");
const app = express();
const args = process.argv.slice(2);
const port = args[0] || 10030;

app.use(express.text()); // 用于解析请求体中的文本
app.get('/html-to-pdf', async (req, res) => {
  try {
      // 设置响应头
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
      const pdfBuffer = await generatePDFFromHTML(req.body);
      res.send(pdfBuffer);
  } catch (error) {
      res.status(500).send('Error generating PDF: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

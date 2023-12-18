const fs = require('fs');
const express = require('express');
const {generatePDFFromHTML} = require("./utils/genPdfFile");
const app = express();
const args = process.argv.slice(2);
const port = args[0] || 10030;
const bodyParser = require('body-parser');
const multer = require('multer');

app.use(express.text({limit: '20mb'})); // 用于解析请求体中的文本

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/htmlfile-to-pdf', upload.single('file'), async (req, res) => {
  // 确保文件已上传
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  // 获取文件内容
  try {
    const fileContent = req.file.buffer.toString('utf-8'); // 或者其他适合文件类型的编码
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    const pdfBuffer = await generatePDFFromHTML(fileContent);
    res.send(pdfBuffer);
  }catch (error) {
      res.status(500).send('Error generating PDF: ' + error.message);
  }
});
app.post('/html-to-pdf', async (req, res) => {
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

const puppeteer = require('puppeteer');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let browserInstance;

async function getBrowserInstance() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            headless: "new", // 明确使用新的无头模式
            args: [
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--no-sandbox",
            ]
        });
    }
    return browserInstance;
}

async function generatePDFFromHTML(htmlString) {
    // 启动Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // const pdfBuffer = await page.pdf({path: 'output.pdf', format: 'a4', rotation: 180});
    // 页眉
    let headerTemplate = "";
    // 页脚
    let footerTemplate = "";
    {
        let dom = new JSDOM(htmlString);
        let document = dom.window.document;
        const elementsToRemove = document.querySelectorAll(".page_start");
        if(elementsToRemove.length > 0) {
            headerTemplate = elementsToRemove[0].outerHTML;
        }
        elementsToRemove.forEach(el => el.parentNode.removeChild(el));  
        updatedHtmlString = dom.serialize();
    }
    
    {
        dom = new JSDOM(updatedHtmlString);
        document = dom.window.document;
        const endelementsToRemove = document.querySelectorAll(".page_end");
        if(endelementsToRemove.length > 0) {
            footerTemplate = endelementsToRemove[0].outerHTML;
        }
        endelementsToRemove.forEach(el => el.parentNode.removeChild(el));  
        updatedHtmlString = dom.serialize();
    }
    // 设置HTML内容并生成PDF的Buffer
    await page.setContent(updatedHtmlString);

    const content = await page.content();
    // 设置 PDF 选项
    const pdfOptions = {
        path: 'example.pdf',
        format: 'a4',
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        margin: {
            top: '60px',
            bottom: '20px',
            left: '20px',
            right: '50px'
        },

    };
    // 生成 PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    // 关闭浏览器实例
    await browser.close();
    return pdfBuffer;
}


module.exports = {
    getBrowserInstance,
    generatePDFFromHTML
};

const puppeteer = require('puppeteer');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let browserInstance;

async function getBrowserInstance() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browserInstance;
}

async function generatePDFFromHTML(htmlString) {
    console.log("generatePDFFromHTML");

    // const pdfBuffer = await page.pdf({path: 'output.pdf', format: 'a4', rotation: 180});
    try {
            // 启动Puppeteer
    const browser = await getBrowserInstance();
    const page = await browser.newPage();
         // 页眉
        let headerTemplate = "";
        // 页脚
        let footerTemplate = "";
        {
            // 构建页眉
            console.log("headerTemplate");
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
            // 构建页脚
            console.log("footerTemplate");
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
         // 如果要生成带着 screen media的pdf，在page.pdf() 前面先调用 page.emulateMedia('screen')
        const pdfBuffer = await page.pdf(pdfOptions);
        return pdfBuffer;
    } catch(error) {
        console.log(error);
    }
}


module.exports = {
    getBrowserInstance,
    generatePDFFromHTML
};

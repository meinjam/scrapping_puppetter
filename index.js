const { default: puppeteer } = require('puppeteer');
const fs = require('fs');
const { msToTime } = require('./utils/functions');

const startTime = performance.now();

const getMedicineInfo = async (currentPage) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(`https://medex.com.bd/brands?page=${currentPage}`);

  const pageMedicines = await page.$$eval('.hoverable-block', (elements) =>
    elements.map((e) => ({
      title: e.querySelector('.data-row-top').innerText,
      generic: e.querySelectorAll('.col-xs-12')[1].innerText,
      strengths: e.querySelector('.data-row-strength .grey-ligten').innerText,
      company: e.querySelector('.data-row-company').innerText,
      link: e.href,
    }))
  );

  //   console.log(pageMedicines);
  await browser.close();
  return pageMedicines;
};

const fetchData = async () => {
  const promises = [];

  for (let i = 1; i <= 10; i++) {
    const promise = getMedicineInfo(i);
    promises.push(promise);
  }

  const medicines = await Promise.all(promises);
  // console.log(medicines);
  const endTime = performance.now();

  fs.writeFile(`medicines.json`, JSON.stringify(medicines), (err) => {
    if (err) throw err;
    console.log('File saved');

    // console.log(endTime - startTime);
    console.log(msToTime(endTime - startTime));
  });
};

fetchData();

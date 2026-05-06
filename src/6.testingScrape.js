import { launch } from "puppeteer";
import { load } from "cheerio";
import { writeFile } from "fs";
import { Parser as j2csv } from "json2csv";

console.log("Launching browser...");

let page = 1;
const maxPage = 2;

let urlArray = [];
let dataArray1 = [];
let dataArray2 = [];

const parser1 = new j2csv();
const parser2 = new j2csv();

await multiPageScraping();

function saveData(location, data) {
  writeFile(location, data, function (err) {
    if (err) {
      console.error(
        "Some error occured - file either not saved or corrupted file saved.",
      );
      console.error(err);
    } else {
      console.log("Saved file successfully!");
    }
  });
}

async function multiPageScraping() {
  const browser = await launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  while (true) {
    try {
      if (page > maxPage) {
        throw "Reached max pages";
      }

      const webPage = await browser.newPage();

      await webPage.goto("https://scrapeme.live/shop/page/" + page + "/");

      await new Promise((res) => setTimeout(res, 500));

      const pageContent = await webPage.content();
      const $ = load(pageContent);

      //error checking for pages that keep going
      let card = ".type-product";

      if ($(card).text() == "" || $(".woocommerce-result-count").text() == "") {
        throw "no more pages";
      }

      $(card).map(function (e, product) {
        let item = $(product);

        const url = item.find("a").attr("href");

        console.log("URLs found: " + url);

        urlArray.push(url);
      });

      console.log("Got data for page " + page);

      console.log("Performing scrap on item pages...");
      console.log("Using the follow URLs: " + urlArray);
      await specificationsScraping();

      saveData(
        "../data/save1-page" + page + ".json",
        JSON.stringify(dataArray1),
      );
      saveData(
        "../data/save2-page" + page + ".json",
        JSON.stringify(dataArray2),
      );

      page++;
    } catch (e) {
      console.error(e);
      await browser.close();

      break;
    }
  }
}

async function specificationsScraping() {
  for (let i = 0; i < urlArray.length; i++) {
    let dataWritten = 0;
    console.log(
      "Getting data for item " +
        (i + 1) +
        " using URL: " +
        urlArray[i] +
        " on page " +
        page,
    );

    const browser = await launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const item = await browser.newPage();
      await item.goto(urlArray[i]);

      await new Promise((res) => setTimeout(res, 500));

      const pageContent = await item.content();
      const $ = load(pageContent);

      let card = ".entry-summary";

      let info = ".wc-tabs-wrapper";

      if ($(card).text() == "" || $(info).text() == "") {
        throw "no info found";
      }

      const htmlCardElement = $(card)
        .map(function (e, product) {
          let item = $(product);

          const name = item.find(".entry-title").text();

          const price = item.find(".woocommerce-Price-amount").text();

          const code = item.find(".sku").text();

          return {
            url: urlArray[i],
            name: name,
            price: price,
            code: code,
          };
        })
        .toArray();

      dataWritten++;

      const htmlInfoElement = $(info)
        .map(function (e, product) {
          let item = $(product);

          const description = item
            .find("#tab-description")
            .children()
            .text()
            .replace("Description", "");
          const weight = item.find(".product_weight").text();
          const dimensions = item.find(".product_dimensions").text();

          return {
            description: description,
            weight: weight,
            dimensions: dimensions,
          };
        })
        .toArray();

      dataWritten = dataWritten + 2;

      dataArray1 = dataArray1.concat(htmlCardElement);
      dataArray2 = dataArray2.concat(htmlInfoElement);

      console.log(dataArray1);
      console.log(dataArray2);
    } catch (e) {
      console.error(e);

      const htmlCardElement = {
        url: urlArray[i],
        name: "",
        price: "",
        code: "",
      };

      const htmlInfoElement = {
        description: "",
        weight: "",
        dimensions: "",
      };

      if (dataWritten != 1 && dataWritten != 3) {
        dataArray1 = dataArray1.concat(htmlCardElement);
      }
      if (dataWritten != 2 && dataWritten != 3) {
        dataArray2 = dataArray2.concat(htmlInfoElement);
      }
    } finally {
      await browser.close();
    }
  }

  urlArray = [];
}

const csv1 = parser1.parse(dataArray1);

saveData("../data/pokemon1.csv", csv1);

const csv2 = parser2.parse(dataArray2);

saveData("../data/pokemon2.csv", csv2);

console.log("\n\n" + "Complete!" + "\n\n");
console.log("Took ~" + performance.now() / 60000 + " minutes");

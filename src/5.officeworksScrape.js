import { launch } from "puppeteer";
import { load } from "cheerio";
import { writeFile } from "fs";
import { Parser as j2csv } from "json2csv";

console.log("Launching browser...");

const baseURL = "https://www.officeworks.com.au";

let page = 1;
const maxPage = 5;

let urlArray = [];
let dataArray1 = [];
let dataArray2 = [];

const parser1 = new j2csv();
const parser2 = new j2csv();

await multiPageScraping();

function sleep(min, max, passChance) {
  if (Math.floor(Math.random * passChance) != 0) {
    let sleepTime = min + Math.random() * max;
    console.log("I'm going to wait for " + sleepTime / 60000 + " minutes.");
    return new Promise((resolve) => setTimeout(resolve, sleepTime));
  }
}

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
  await sleep(2 * 60000, 5 * 60000, 4);

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

      await webPage.goto(
        baseURL +
          "/shop/officeworks/search?q=monitor&view=grid&page=" +
          page +
          "&sortBy=bestmatch",
      );

      await new Promise((res) => setTimeout(res, 500));

      const pageContent = await webPage.content();
      const $ = load(pageContent);

      //error checking for pages that keep going
      let card = ".styles__ProductInfoWrapper-sc-1k8cpym-3";

      if ($(card).text() == "" || $(".fJshrd").text() == "") {
        throw "No more pages";
      }

      $(card).map(function (e, product) {
        let item = $(product);

        const url = baseURL + item.find("a").attr("href");

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
        i++ +
        " using URL: " +
        urlArray[i] +
        " on page " +
        page--,
    );

    await sleep(2 * 60000, 5 * 60000, 4);

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

      let card = ".styles__ProductContentWrapper-sc-i7hfje-4";

      let info = ".iKnnPD";

      if ($(card).text() == "" || $(info).text() == "") {
        throw "no info found";
      }

      const htmlCardElement = $(card)
        .map(function (e, product) {
          let item = $(product);

          const name = item.find(".sc-dIHSXr").text();

          const price = item.find(".sc-hsPFbj").text();

          const brand = item.find(".style__Link-sc-1jfp2c6-4").text();

          const code = item
            .find(".style__Detail-sc-1jfp2c6-3 strong")
            .text()
            .replace(brand, "");

          return {
            url: urlArray[i],
            name: name,
            price: price,
            brand: brand,
            code: code,
          };
        })
        .toArray();

      dataWritten++;

      const htmlInfoElement = $(info)
        .map(function (e, product) {
          let item = $(product);

          const warranty = item
            .find(".dvZZfr:contains('Warranty')")
            .next()
            .text();
          const panel = item
            .find(".dvZZfr:contains('Display Panel Type')")
            .next()
            .text();
          const cableManagement = item
            .find(".dvZZfr:contains('Cable Management')")
            .next()
            .text();
          const colour = item
            .find(".dvZZfr:contains('Descriptive Colour')")
            .next()
            .text();
          const aspectRatio = item
            .find(".dvZZfr:contains('Image Aspect Ratio')")
            .next()
            .text();
          const backlight = item
            .find(".dvZZfr:contains('LCD Backlight Technology')")
            .next()
            .text();
          const weight = item
            .find(".dvZZfr:contains('Product Weight')")
            .next()
            .text();
          const connections = item
            .find(".dvZZfr:contains('Display Connections')")
            .next()
            .text();
          const colourGamut = item
            .find(".dvZZfr:contains('Colour Gamut')")
            .next()
            .text();
          const resolution = item
            .find(".dvZZfr:contains('Display Resolution')")
            .next()
            .text();
          const size = item
            .find(".dvZZfr:contains('Display Size')")
            .next()
            .text();
          const screenShape = item
            .find(".dvZZfr:contains('Screen Shape')")
            .next()
            .text();
          const antiGlare = item
            .find(".dvZZfr:contains('Anti-Glare')")
            .next()
            .text();
          const countryOfManufacture = item
            .find(".dvZZfr:contains('Country of Manufacture')")
            .next()
            .text();
          const flickerFree = item
            .find(".dvZZfr:contains('Flicker Free')")
            .next()
            .text();
          const daisyChain = item
            .find(".dvZZfr:contains('Daisy Chain')")
            .next()
            .text();
          const freeSync = item
            .find(".dvZZfr:contains('FreeSync')")
            .next()
            .text();
          const GSync = item.find(".dvZZfr:contains('G-Sync')").next().text();
          const tiltAdjustment = item
            .find(".dvZZfr:contains('Tilt Adjustment')")
            .next()
            .text();
          const pivotAdjustment = item
            .find(".dvZZfr:contains('Pivot Adjustment')")
            .next()
            .text();
          const swivelAdjustment = item
            .find(".dvZZfr:contains('Swivel Adjustment')")
            .next()
            .text();
          const colourSupport = item
            .find(".dvZZfr:contains('Colour Support')")
            .next()
            .text();
          const heightAdjustable = item
            .find(".dvZZfr:contains('Height Adjustable')")
            .next()
            .text();
          const horizontalViewingAngle = item
            .find(".dvZZfr:contains('Horizontal Viewing Angle')")
            .next()
            .text();
          const verticalViewingAngle = item
            .find(".dvZZfr:contains('Vertical Viewing Angle')")
            .next()
            .text();
          const imageBrightness = item
            .find(".dvZZfr:contains('Image Brightness')")
            .next()
            .text();
          const imageContrastRatio = item
            .find(".dvZZfr:contains('Image Contrast Ratio')")
            .next()
            .text();
          const refreshRate = item
            .find(".dvZZfr:contains('Refresh Rate')")
            .next()
            .text();
          const responseTime = item
            .find(".dvZZfr:contains('Response Time')")
            .next()
            .text();
          const vesaMountCompatibility = item
            .find(".dvZZfr:contains('Vesa Mount Compatibility')")
            .next()
            .text();
          const headphoneSpeakerPorts = item
            .find(".dvZZfr:contains('Headphone/Speaker Ports')")
            .next()
            .text();
          const displayPortPorts = item
            .find(".dvZZfr:contains('DisplayPort Ports')")
            .next()
            .text();
          const HDMIPorts = item
            .find(".dvZZfr:contains('HDMI Ports')")
            .next()
            .text();
          const USBCPorts = item
            .find(".dvZZfr:contains('USB-C Ports')")
            .next()
            .text();
          const powerConsumption = item
            .find(".dvZZfr:contains('Power Consumption Operational')")
            .next()
            .text();
          const speakers = item
            .find(".dvZZfr:contains('Built-in Speakers')")
            .next()
            .text();

          return {
            warranty: warranty,
            panel: panel,
            cableManagement: cableManagement,
            colour: colour,
            aspectRatio: aspectRatio,
            backlight: backlight,
            weight: weight,
            connections: connections,
            colourGamut: colourGamut,
            resolution: resolution,
            size: size,
            screenShape: screenShape,
            antiGlare: antiGlare,
            countryOfManufacture: countryOfManufacture,
            flickerFree: flickerFree,
            daisyChain: daisyChain,
            freeSync: freeSync,
            GSync: GSync,
            tiltAdjustment: tiltAdjustment,
            pivotAdjustment: pivotAdjustment,
            swivelAdjustment: swivelAdjustment,
            colourSupport: colourSupport,
            heightAdjustable: heightAdjustable,
            horizontalViewingAngle: horizontalViewingAngle,
            verticalViewingAngle: verticalViewingAngle,
            imageBrightness: imageBrightness,
            imageContrastRatio: imageContrastRatio,
            refreshRate: refreshRate,
            responseTime: responseTime,
            vesaMountCompatibility: vesaMountCompatibility,
            headphoneSpeakerPorts: headphoneSpeakerPorts,
            displayPortPorts: displayPortPorts,
            HDMIPorts: HDMIPorts,
            USBCPorts: USBCPorts,
            powerConsumption: powerConsumption,
            speakers: speakers,
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
        brand: "",
        code: "",
      };

      const htmlInfoElement = {
        warranty: "",
        panel: "",
        cableManagement: "",
        colour: "",
        aspectRatio: "",
        backlight: "",
        weight: "",
        connections: "",
        colourGamut: "",
        resolution: "",
        size: "",
        screenShape: "",
        antiGlare: "",
        countryOfManufacture: "",
        flickerFree: "",
        daisyChain: "",
        freeSync: "",
        GSync: "",
        tiltAdjustment: "",
        pivotAdjustment: "",
        swivelAdjustment: "",
        colourSupport: "",
        heightAdjustable: "",
        horizontalViewingAngle: "",
        verticalViewingAngle: "",
        imageBrightness: "",
        imageContrastRatio: "",
        refreshRate: "",
        responseTime: "",
        vesaMountCompatibility: "",
        headphoneSpeakerPorts: "",
        displayPortPorts: "",
        HDMIPorts: "",
        USBCPorts: "",
        powerConsumption: "",
        speakers: "",
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

saveData("../data/monitors1.csv", csv1);

const csv2 = parser2.parse(dataArray2);

saveData("../data/monitors2.csv", csv2);

console.log("\n\n" + "Complete!" + "\n\n");

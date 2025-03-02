const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const fs = require('fs');
const j2csv = require("json2csv").Parser;


const { exec } = require("node:child_process")
const { promisify } = require("node:util")


let page=1;
while(true){
  try{
 
    //try axios first - faster, if it doesn't work try puppeteer



    const $ = cheerio.load(pageContent);


      //cheerio stuff here


        let card = "                  ";




        if ($(card).text() == "") {
          throw "no more pages";
        }


        //jquery .map is a bit different than array.map
        const htmlElement = $(card).map(function (e, product) {
            // 'e' is the index


            let item = $(product); //NOTE 2


            const name = item.find("a").text();


            return {name:name};//separate each key-value pair with a ","
          })
          .toArray();


        //console.log(htmlElement);
        fullArray = fullArray.concat(htmlElement); //add new items to the global array


        page++;
     
    }catch(error) {
      console.error(error.message);


      await browser.close()
      break;
    }
   
  } //end while
console.log("using axios");

const cheerio = require("cheerio");
const axios = require("axios");

const fs = require('fs');
const j2csv = require("json2csv").Parser;

let fullArray=[];

multiPageScraping();

async function multiPageScraping(){
  let page = 1;

  while(true){ //while (true) if it is to run for all pages, while(page< X) for X number of pages

    try{

        //axios or puppeteer


    const $ = cheerio.load(axiosResponse.data);
      //console.log($);
      const htmlElement = await Promise.all(
        $('     ').map(async function(e,    ) { 

            //const name = ;  //AND FOR EACH LOT OF INFORMATION TO SCRAPE//



      let details=await detailedPageScraping(url);
    
      return {          } 
    }) 
    .toArray()
      ); 

    console.log('Data fetched successfully,page '+page);

    fullArray=fullArray.concat(htmlElement); //add new items to the global array
    
    page++;
    }catch(error){
        console.error("Run out of pages");     
        break
    }    
  }
  

  const parser = new j2csv();
  const csv = parser.parse(fullArray);
  fs.writeFile('test.csv', csv, function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else{
      console.log('It\'s saved!');
    }
  });

  async function detailedPageScraping(pageUrl){

    try{
        //axios or puppeteer
  
    let $1 = cheerio.load(axiosResponse.data);    
    let price = ;
    let rating = ;
    let genre = ;

    return [price, rating,genre];

    } catch(error) {
        console.error(error);
        return [null, null,null];
    }  

}

}

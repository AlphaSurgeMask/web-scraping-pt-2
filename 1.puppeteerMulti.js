async function multipageScraping() {

    // find path to chromium
    const { stdout: chromiumPath } = await promisify(exec)("which chromium")
  
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: chromiumPath.trim()
    });
  
    let page=1;
    while(true){
      try{
        
        const webPage = await browser.newPage()
  
        await webPage.goto("https://www.officeworks.com.au/shop/officeworks/search?q=macbook&view=grid&page="+page+"&sortBy=bestmatch")
  
        // wait for page to render
        await new Promise(res => setTimeout(res, 500))
  
        const pageContent = await webPage.content();
        const $ = cheerio.load(pageContent);
  
        //cheerio stuff here
        console.log($('.styles__ProductInfoWrapper-sc-1k8cpym-3 a').eq(0).text());
  
          //error checking for pages that keep going
          let card = ".styles__ProductInfoWrapper-sc-1k8cpym-3";
          //console.log($(card).text());
  
          if ($(card).text() == "") {
            throw "no more pages";
          }
  
          //jquery .map is a bit different than array.map
          const htmlElement = $(card).map(function (e, product) {
              // 'e' is the index
  
              let item = $(product);
  
              const name = item.find("a").text();
  
              return {name:name};
            })
            .toArray();
  
          //console.log(htmlElement);
          fullArray = fullArray.concat(htmlElement); //add new items to the global array
          console.log(fullArray);
          page++;
          console.log(page);
        
      }catch(error) {
        console.error(error.message);
  
        await browser.close()
        break;
      }
      
    } //end while
  
  
  }
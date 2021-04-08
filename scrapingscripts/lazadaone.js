const puppeteer = require('puppeteer');
const autoScrollDown = require('puppeteer-autoscroll-down');
// wait function 
const wait = (sec)=>{
    return new Promise(resolve=>{
        setTimeout(resolve, sec * 1000)
    })
}
module.exports.scrapeOne = async(url)=>{
    const browser = await puppeteer.launch({headless: false});
    try{
        const page = await browser.newPage();
        await page.goto(url);
        await wait(5);
        await autoScrollDown(page);
        await wait(5);
        const data = await page.evaluate(()=>{
            const images = [];
            const details = [];
            const reviewImages = [];
            const reviewTexts = [];
            let category = '';
            // product name
            const name = document.querySelector('.pdp-mod-product-badge-title').textContent;
            // category 
            const categoryNodes = document.querySelectorAll('#J_breadcrumb li');
            for(let i = 0; i < categoryNodes.length - 1; i++) {
                category += categoryNodes[i].textContent.trim();
            }
            // rating numbers 
           const ratingNumbers = document.querySelector('.pdp-link.pdp-link_size_s.pdp-link_theme_blue.pdp-review-summary__link').textContent.replace('Ratings', '').trim();
           // rating stars 
           const ratingStars = +document.querySelector('.score-average').textContent;
           // get images 
           const imagesNodes = document.querySelectorAll('.pdp-mod-common-image.item-gallery__thumbnail-image');
           for(let i = 0; i < imagesNodes.length; i++){
               images.push(imagesNodes[i].src.replace('80x80', '720x720'));
            }
           // price 
           const price = +document.querySelector('.pdp-price.pdp-price_type_normal.pdp-price_color_orange.pdp-price_size_xl').textContent.replace('RM', '');
  
          // let product details 
          const productDetails = document.querySelectorAll('.html-content.pdp-product-highlights  li');
          for(let i = 0; i < productDetails.length; i++){
              details.push(productDetails[i].textContent);
        }
        // review images = 
        const review_images = document.querySelectorAll('.review-image .image');
        for(let i = 0; i < review_images.length; i++){
            reviewImages.push(review_images[i].style.backgroundImage.replace('url("', '').replace('")', ''));
        }

        // review text 
        const review_texts = document.querySelectorAll('.pdp-mod-review .content');

        for(let i = 1; i < review_texts.length; i++){
            reviewTexts.push(review_texts[i].textContent);
        }
        return {
            name,
            category,
            rating:{
                number: ratingNumbers,
                stars: ratingStars
            },
            ratingStars,
            price,
            images,
            details,
            reviews: {
                text: reviewTexts,
                images: reviewImages
            }
        }
    })
    await page.goto('https://www.youtube.com/');
    await wait(2)
    await page.type('#search', data.name);
    await page.click('#search-icon-legacy');
    await wait(5);
    await page.click('.style-scope.ytd-video-renderer yt-img-shadow #img.style-scope.yt-img-shadow');
    await wait(4);
    await page.click('svg [d="M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z"]');
    await wait(2);
    await page.click('.icon-resize.style-scope.yt-share-target-renderer');
    await wait(2);
    const video = await page.evaluate(()=>{
        const videoFrame = document.querySelector('#embed-code').textContent.trim();
        return videoFrame;
    })
    data.video = video;
    await browser.close();
    return data;
    }catch(e){
        await browser.close();
    }
    
}
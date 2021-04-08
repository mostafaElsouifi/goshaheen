if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Product = require('../models/product');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('db connected')
})
.catch((e)=>{
    console.log('error connection')
})



const seedDb = async()=>{
    const product = {
        name: 'headphone lorem1',
        category: 'Electronics Accessories/Computer Accessories/PC Audio/Gaming Headsets',
        price:157.40,
        images:[
            'http://my-test-11.slatic.net/p/4a4fbc1706f09c1a63a2297652ca5023.jpg_720x720q80.jpg_.webp',
            'http://my-test-11.slatic.net/p/cf560a636efcbcd333abeb947ea92592.jpg_720x720q80.jpg_.webb',
            'http://my-test-11.slatic.net/p/110d554cd8d746d1757beff12d7edb0d.jpg_720x720q80.jpg_.webp',
            'http://my-test-11.slatic.net/p/024e0d9d4b0d9d13bdc2ab5541407029.jpg_720x720q80.jpg_.webp',
            'http://my-test-11.slatic.net/p/b1e7d8d29adc51ed2a409571e10a351e.jpg_720x720q80.jpg_.webp'
        ],
        details:[
            '7.1 surround sound: 360° surround sound effect and complete immersion in the gaming world',
            'RGB light effects: gradually varied colors supported by RGB dynamic backlight technology',
            '50mm driver unit: 50mm NdFeB unit for clear sound and powerful low-frequency performance',
            'High-performance microphone: detachable and flexible 6mm electret condenser microphone,',
            'omnidirectional reception',
            'Comfortable wearing: lightweight designed headband and soft leatherette earmuffs for a snug fit'
        ],
        rating:{
            number: 246,
            stars:5
        },
        reviews:{
            text:[
                'item received in good condition and fast delivery..function very well..admin respond fast when asking..good..',
                'It perfectly fits my setup. Sound quality is great paired with the Edifier Gaming Center App.',
                'The headset working fine and as advertised. The color so pretty. Sounds quality great and the noise cancelling working so great',
                'great quality! bought 1 black and 1 pink for my mum, love them! thank you so much to the seller for excellent service and fast delivery process',
                'Sealed and original, 1 layer of bubble wrap but box is still nice and not damaged. Ears have to stick on yourself but use 3M double sided tape so still ok. The sound is nice, the mic quality is good too. Got button to mute mic. Can choose to on/off rgb. Application to install on computer not much feature. The mic cover hole also quite small but after stretching and squeezing in it works. Overall quite good for the price.',
                'good quality ! item came very fast. worth the money for RM 109 during flash sale! good surround sound , user friendly.',
                'Great product. Satisfied all are well functioning. Thank youu',
                'I love the headset! The service is great! delivery is fast!(within 2 days) and the headset is worth the price! I did a review of it on my youtube channel eddyfazly /',
                'The headset working fine and as advertised. The color so pretty. Sounds quality great and the noise cancelling working so great',
                'great quality! bought 1 black and 1 pink for my mum, love them! thank you so much to the seller for excellent service and fast delivery process',
                'Sealed and original, 1 layer of bubble wrap but box is still nice and not damaged. Ears have to stick on yourself but use 3M double sided tape so still ok. The sound is nice, the mic quality is good too. Got button to mute mic. Can choose to on/off rgb. Application to install on computer not much feature. The mic cover hole also quite small but after stretching and squeezing in it works. Overall quite good for the price.',
                'good quality ! item came very fast. worth the money for RM 109 during flash sale! good surround sound , user friendly.',
                'Great product. Satisfied all are well functioning. Thank youu',
                'I love the headset! The service is great! delivery is fast!(within 2 days) and the headset is worth the price! I did a review of it on my youtube channel eddyfazly /',
                'good quality ! item came very fast. worth the money for RM 109 during flash sale! good surround sound , user friendly.',
                'Great product. Satisfied all are well functioning. Thank youu',
                'I love the headset! The service is great! delivery is fast!(within 2 days) and the headset is worth the price! I did a review of it on my youtube channel eddyfazly /',
                'The headset working fine and as advertised. The color so pretty. Sounds quality great and the noise cancelling working so great',
                'great quality! bought 1 black and 1 pink for my mum, love them! thank you so much to the seller for excellent service and fast delivery process',
                'Sealed and original, 1 layer of bubble wrap but box is still nice and not damaged. Ears have to stick on yourself but use 3M double sided tape so still ok. The sound is nice, the mic quality is good too. Got button to mute mic. Can choose to on/off rgb. Application to install on computer not much feature. The mic cover hole also quite small but after stretching and squeezing in it works. Overall quite good for the price.',
                'good quality ! item came very fast. worth the money for RM 109 during flash sale! good surround sound , user friendly.',
                'Great product. Satisfied all are well functioning. Thank youu',
                'I love the headset! The service is great! delivery is fast!(within 2 days) and the headset is worth the price! I did a review of it on my youtube channel eddyfazly /',
    
            ],
            images:[
                'https://sg-test-11.slatic.net/other/roc/3f5038929e1b1d6a3edf49d68bf379b2.jpg',
                'https://sg-test-11.slatic.net/other/roc/e39e832d29c7cc8211d087dc4abdcec3.jpg',
                'https://sg-test-11.slatic.net/other/roc/6872a1d12ff8b5914efb85243eb14ae3.jpg',
                'https://sg-test-11.slatic.net/other/roc/c19277dfbaeee74f4a4ed86374ffbefb.jpg'
            ]
        },
        video:
            '<iframe width="560" height="315" src="https://www.youtube.com/embed/13JzNCGF1Xk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        store:'shoppe'
    }
    await Product.deleteMany({});
    // for(let i = 0; i < 100; i++){
    //     const newproduct = new Product(product);
    //     await newproduct.save();

    // }
}
seedDb().then(()=>{
    mongoose.connection.close();
})

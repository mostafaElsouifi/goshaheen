const fetch = require('node-fetch');
const getCountry = async()=>{
    const getData = await fetch(`http://api.ipstack.com/check?access_key=${process.env.IPSTACK_KEY}`);
    const result = await getData.json();
    return result.country_name;
}

module.exports = getCountry;
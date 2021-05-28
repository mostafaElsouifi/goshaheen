const getCountry = async()=>{
    const getData = await fetch(`http://api.ipstack.com/check?access_key=6d6fd9a7eeadd6c5f60c21b8b8c326b5`);
    const result = await getData.json();
    if(!window.location.href.includes('/my') && result.country_name === 'Malaysia' && window.location.pathname === '/'){
        window.location.href = '/my';
    }
    if(!window.location.href.includes('/sa') && result.country_name === 'Saudi Arabia' && window.location.pathname === '/'){
        window.location.href = '/sa';
    }
    if(!window.location.href.includes('/us') && result.country_name === 'United States' && window.location.pathname === '/'){
        window.location.href = '/us';
    }
   
}

getCountry();

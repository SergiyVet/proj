const apikey="9d4ce9c4950e9729a5338d4811bf43a5";
window.addEventListener("load",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                console.log(data);
                console.log(new Date().getTime())
                
                console.log(new Date().toString())
                
                weatherReport(data);
            })
        })
    }
})


function searchByCity(){
    var place= document.getElementById('input').value;
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value='';
}

function weatherReport(data){

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast);
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)
        
        console.log(data);
        
        const dt = data.dt; // unix timestamp in seconds
        const timezone = data.timezone; // zone in seconds

        // moment.unix - Unix Timestamp (seconds)
        const dateTime = moment.unix(dt).utc().add(timezone, 's');

        console.log(dateTime);
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description)
        
        let icon1= data.weather[0].icon;
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl
    })

}

function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000);
        
        console.log((date.toLocaleTimeString(undefined,'en-US')).replace(':00',''))
        

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'en-US')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let icon2= forecast.list[i].weather[0].icon;
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon2 +".png";
        console.log(iconurl);
        let imgs= document.createElement('img');
        imgs.src = iconurl;
        let dec = forecast.list[i].weather[0].description;
        imgs.title = dec;

        let desc= document.createElement('p');
        desc.setAttribute('class','desc');
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(imgs)
        //hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML='';
    let dayq;
        for (let q = 0; q <10; q++) {
        var u = forecast.list[q].dt_txt;
        var s = '00:00:00';

        if (u.includes(s)) {
            dayq = q;
        }
    }

    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'en-US');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let description= document.createElement('p');
        description.setAttribute('class','desc')
        description.innerText= forecast.list[i].weather[0].description;
        //div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
        //*
        let t = document.createElement('div');
        t.setAttribute('class','templist');
        div.appendChild(t);
        
        //console.log(forecast.list.slice(dayq, dayq+8));
        let forecastq =forecast.list.slice(dayq, dayq+8);
        for (let i = 0; i <forecastq.length; i+=2) {
            var date= new Date(forecastq[i].dt*1000);
            let n = document.createElement('div');
            n.setAttribute('class','next');
            t.appendChild(n);

            let d = document.createElement('div');
            let im = document.createElement('img');
            n.appendChild(d);
            n.appendChild(im);
            let p = document.createElement('p');
            let p2 = document.createElement('p');
            p.setAttribute('class','time');
            d.appendChild(p);
            d.appendChild(p2);
            let icon2= forecastq[i].weather[0].icon;
            let iconurl= "http://api.openweathermap.org/img/w/"+ icon2 +".png";
            im.src=iconurl;
            im.title=forecastq[i].weather[0].description
            p.innerText= (date.toLocaleTimeString(undefined,'en-US')).replace(':00','');
            p2.innerText= Math.floor((forecastq[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecastq[i].main.temp_min - 273))+ ' °C';;
        };
        dayq = dayq+8;

    }
}

function read(forecast) {
    let day = document.querySelector('.dayF');
    let h = document.createElement('div');
    h.setAttribute('class','templist');
    day.appendChild(h);
} 

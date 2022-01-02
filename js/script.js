const APIKey = `a545225a1ccf440395c280936ba0c361`;
const cityText = document.getElementById('citytext');
const countryCode = document.getElementById('countrycode');
const btn = document.getElementById('submit');
const animen = document.getElementById('alladivs');

// Main knappen!
btn.addEventListener('click', function (e) {
    e.preventDefault();
    setMessage(`...Söker efter vädret i ${cityText.value}...`);

    //Dagens info
    const currentUrl = `https://api.weatherbit.io/v2.0/current?city=${cityText.value}&country=${countryCode.value}&key=${APIKey}&include=minutely&lang=sv`;

    //Kommande 5 dagarna, plus dagens
    const url5 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityText.value}&country=${countryCode.value}&key=${APIKey}&lang=sv&days=6`;
    console.log(currentUrl)

    // Fetch Dagens info:
    fetch(currentUrl)
        .then(
            //Kollar att vi får ett OK från servern:
            function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else {
                    throw 'Något gick fel.. Testa igen nu eller lite senare!';
                };
            })
        .then(
            function (weatherData) {
                //Meddelandet när vi söker efter stad: 
                const h2 = document.querySelector('#message');
                h2.style.display = 'none';

                const ikonen = weatherData.data[0].weather.icon;
                const timeZone = weatherData.data[0].timezone;
                const city = weatherData.data[0].city_name;

                //Skriver ut infon till divarna i 'alladivs':
                document.getElementById('staden').innerHTML = city;
                document.getElementById('tidzon').innerHTML = 'Tidzon: ' + timeZone;
                
                document.getElementById('ikonerna').src = `https://bennygrit.github.io/Icons/icons/${ikonen}.png`;
                document.getElementById('temperaturenidag').innerHTML = weatherData.data[0].temp + ' °C';
                document.getElementById('vindhastighetidag').innerHTML = 'Vindhastighet: ' + weatherData.data[0].wind_spd + ' m/s';
                document.getElementById('vadretidag').innerHTML = 'Idag är det ' + weatherData.data[0].weather.description + ' i ' + weatherData.data[0].city_name;
                document.getElementById('blaseridag').innerHTML = 'Just nu blåser det åt ' + weatherData.data[0].wind_cdir_full;
                document.getElementById('luftfuktighet').innerHTML = 'Relativ luftfuktighet: ' + weatherData.data[0].rh + ' RH';

                //Byter bakgrund beroende på vädret
                document.body.style.backgroundImage = `url('img/${ikonen}.png')`;

                // Lägger till länkar till Wikipedia och Google:
                let text = `Läs mer om  ${city} på Wikipedia här:`;
                let result = text.link(`https://sv.wikipedia.org/wiki/${city}`);
                document.getElementById('wikipedia').innerHTML = result;

                let theText = `Read more about ${city} on Wikipedia here:`;
                let resultEng = theText.link(`https://wikipedia.org/wiki/${city}`);
                document.getElementById('wikipediaEng').innerHTML = resultEng;

                document.getElementById('google').onclick = function google() {
                    window.open('http://google.com/search?q=' + city);
                };
                
                document.getElementById('google').innerHTML = `Sök på ${city} på www.google.se här: `;

                //Scrollar ner sidan så att man kan se all sökresultat utan att behöva scrolla ner:
                const scroll = document.getElementById('flex5days');
                scroll.scrollIntoView();

                //Lägger till de senaste sökta städerna. No Limit.
                let node = document.createElement('li');
                let textnode = document.createTextNode(city);

                node.appendChild(textnode);
                document.getElementById('searchedFor').appendChild(node);

                //API TIMEZONE - för att få fram lokal tid och datum för sökta städer:
                const APIKeyTime = `E1TC659V7GK0`;

                const timeZoneURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=E1TC659V7GK0&format=json&by=zone&zone=${timeZone}`;

                fetch(timeZoneURL)
                    .then(
                        function (timeResponse) {
                            console.log(timeResponse);
                            return timeResponse.json();
                        }
                    ).then(
                        function (timeZoneData) {
                            console.log(timeZoneData.timestamp);
                            console.log(timeZoneData.formatted);
                            document.getElementById('idag').innerHTML = 'Lokal datum och tid: ' + '<br>' + timeZoneData.formatted;
                        }
                    );
            })
        .catch(
            //Skriver ut felmeddelande beroende på om användaren glömt skriva en stad, eller om staden inte finns:
            function (error) {
                if (cityText.value === '') {
                    setMessage(`Glöm inte skriva en stad. Tex Malmö.`);
                }
                else {
                    setMessage(`Vad tusan är DET för en stad?! ...'${cityText.value}'... Testa igen :)`);
                };

                // Gör helt meningslösa, men roliga animeér ifall det blir ett error enligt ovan:
                anime({
                    targets: '#ikonerna',
                    rotate: '1turn',
                    easing: 'linear',
                    direction: 'alternate',
                    duration: 750,
                })

                anime({
                    targets: '#submit',
                    rotate: '1turn',
                    easing: 'linear',
                    direction: 'alternate',
                    duration: 750
                })
            });

    function setMessage(message) {
        //Meddelandet när vi söker efter stad: 
        const h2 = document.querySelector('#message');
        h2.style.display = 'block';
        h2.innerText = message;
    }

    //Fetch kommande 5 dagar:
    fetch(url5)
        .then(
            //Kollar att vi får ett OK från servern:
            function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else {
                    throw 'Något gick fel.. Testa igen nu eller om ett litet tag! :)';
                };
            })
        .then(
            //Slänger upp infon till flex5days diven.
            function (weatherData5) {
                for (let i = 1; i < 6; i++) {
                    const datum = weatherData5.data[i].valid_date;
                    const temperatur = weatherData5.data[i].temp + ' °C';
                    const beskrivning = weatherData5.data[i].weather.description;
                    const ikonen5 = weatherData5.data[i].weather.icon;

                    document.getElementById(i).innerHTML = datum + ' <br>' + temperatur + '<br> ' + beskrivning;
                    document.getElementById('ikonen' + [i]).src = `https://bennygrit.github.io/Icons/icons/${ikonen5}.png`;

                };
            });
});

//Knappen för att se vilka landskoder som finns
function landskoder() {
    window.open('https://www.riksgalden.se/globalassets/dokument_sve/pm/riksgaldsspar/landskoder-riksgalden.pdf');
};

// Färgschema för rutorna
function blue() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = 'rgba(1, 1, 173, 0.63)';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = 'rgba(1, 1, 173, 0.63)';
    };
    document.getElementById('alladivs').style.backgroundColor = 'rgba(1, 1, 173, 0.63)';
    document.querySelector('footer').style.backgroundColor = 'blue';
};

function yellow() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = 'rgb(235, 235, 6, .7)';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = 'rgb(235, 235, 6, .7)';
    };
    document.getElementById('alladivs').style.backgroundColor = 'rgb(235, 235, 6, .7)';
    document.querySelector('footer').style.backgroundColor = 'yellow';
};

function green() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = 'rgb(4, 148, 4, .7)';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = 'rgb(4, 148, 4, .7)';
    };
    document.getElementById('alladivs').style.backgroundColor = 'rgb(4, 148, 4, .7)';
    document.querySelector('footer').style.backgroundColor = 'green';
}

function grey() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = 'rgb(100, 100, 100, .7)';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = 'rgb(100, 100, 100, .7)';
    };
    document.getElementById('alladivs').style.backgroundColor = 'rgb(100, 100, 100, .7)';
    document.querySelector('footer').style.backgroundColor = 'grey';
};

function hotpink() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = 'rgb(253, 93, 173, .7)';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = 'rgb(253, 93, 173, .7)';
    };
    document.getElementById('alladivs').style.backgroundColor = 'rgb(253, 93, 173, .7)';
    document.querySelector('footer').style.backgroundColor = 'hotpink';
};

function purple() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = 'rgb(153, 6, 153, 0.7)';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = 'rgb(153, 6, 153, 0.7)';
    };
    document.getElementById('alladivs').style.backgroundColor = 'rgb(153, 6, 153, 0.7)';
    document.querySelector('footer').style.backgroundColor = 'purple';
};

function rainbow() {
    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundImage = `linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)`;
        fieldset[i].style.opacity = '0.7';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundImage = `linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)`;
        elements[i].style.opacity = '0.7';
    };
    document.getElementById('alladivs').style.backgroundImage = `linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)`;
    document.querySelector('footer').style.backgroundImage = `linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)`;

    document.getElementById('alladivs').style.opacity = '0.7';
};

// Knappen där användaren själv kan skriva vilken färg som ska användas:
const clrBtn = document.getElementById('userchoicebtn');
clrBtn.addEventListener('click', function (prev) {
    prev.preventDefault();

    const usercolor = document.getElementById('searchcolor');
    document.getElementById('alladivs').style.backgroundColor = usercolor.value;
    document.getElementById('alladivs').style.opacity = '0.7';

    const fieldset = document.getElementsByClassName('fieldset');
    for (let i = 0; i < fieldset.length; i++) {
        fieldset[i].style.backgroundColor = usercolor.value;
        fieldset[i].style.opacity = '0.7';
    };

    const elements = document.getElementsByClassName('divs5');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = usercolor.value;
        elements[i].style.opacity = '0.7';
    };
});
// Länk med lista till olika färger på Engelska
let text = `Se en lista på olika färger på Engelska på Wikipedia: `;
document.getElementById('colorsEng').innerHTML = text.link(`https://simple.wikipedia.org/wiki/List_of_colors`);
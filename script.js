const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const submitBtn = document.querySelector(".top-banner .submitBtn");
const clearBtn = document.querySelector(".top-banner .clear")

const apiKey = "c15575df54c2e639edf54d628de1899d";

let arrayCities = new Array();
if(localStorage.getItem('listCities') != null && localStorage.getItem('listCities') != "") initialize();

submitBtn.addEventListener("click", e => {
    e.preventDefault();
    let inputVal = input.value;
    
    if ('geolocation' in navigator && inputVal.toLowerCase().replace(' ','') === "actual") {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const { main, name, sys, weather } = data;

                    const listItems = list.querySelectorAll(".ajax-section .city");
                    const listItemsArray = Array.from(listItems);

                    if (listItemsArray.length > 0) {
                        const filteredArray = listItemsArray.filter(el => {
                            let content = el.querySelector(".city-name span").textContent.toLowerCase();
                            return content == name.toLowerCase();
                        });

                        if (filteredArray.length > 0) {
                            msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent}... otherwise be more specific by providing the country code as well`;
                            form.reset();
                            input.focus();
                            return;
                        }
                    }

                    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                        weather[0]["icon"]
                    }.svg`;

                    const li = document.createElement("li");
                    li.classList.add('city');
                    const markup = `
                        <h2 class = "city-name" data-name="${name},${sys.country}">
                            <span>${name}</span>
                            <sup>${sys.country}</sup>
                        </h2>
                        <div class="city-temp">
                        ${Math.round(main.temp)}<sup>°C</sup>
                        </div>
                        <figure>
                            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                            <figcaption>${weather[0]["description"]}</figcaption>
                        </figure>
                    `;
                    li.innerHTML = markup;
                    list.appendChild(li);
                    arrayCities.push(`${name},${sys.country}`);
                    localStorage.setItem('listCities',arrayCities.join('_'));
                    clearBtn.style.display = "block";
                })
                .catch (error => {
                    msg.textContent = "Please search for a valid city";
                    console.log(error.message);
                });
            }, () => msg.textContent = "Couldn't get access to location");
    }

    else {
        const listItems = list.querySelectorAll(".ajax-section .city");
        const listItemsArray = Array.from(listItems);

        if (listItemsArray.length > 0) {
            const filteredArray = listItemsArray.filter(el => {
                let content = "";
                if (inputVal.includes(",")) {
                    if (inputVal.split(",")[1].length > 2) {
                        inputVal = inputVal.split(",")[0];
                        content = el.querySelector(".city-name span").textContent.toLowerCase();
                    } else {
                        content = el.querySelector(".city-name").dataset.name.toLowerCase();
                    }
                } else {
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                }
                return content == inputVal.toLowerCase();
            });

            if (filteredArray.length > 0) {
                msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent}... otherwise be more specific by providing the country code as well`;
                form.reset();
                input.focus();
                return;
            }
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { main, name, sys, weather } = data;
                const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                    weather[0]["icon"]
                }.svg`;

                const li = document.createElement("li");
                li.classList.add('city');
                const markup = `
                    <h2 class = "city-name" data-name="${name},${sys.country}">
                        <span>${name}</span>
                        <sup>${sys.country}</sup>
                    </h2>
                    <div class="city-temp">
                    ${Math.round(main.temp)}<sup>°C</sup>
                    </div>
                    <figure>
                        <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                        <figcaption>${weather[0]["description"]}</figcaption>
                    </figure>
                `;
                li.innerHTML = markup;
                list.appendChild(li);
                arrayCities.push(`${name},${sys.country}`);
                localStorage.setItem('listCities',arrayCities.join('_'));
                clearBtn.style.display = "block";
            })
            .catch (error => {
                msg.textContent = "Please search for a valid city";
                console.log(error.message);
            });
    }
    
    msg.textContent = "";
    form.reset();
    input.focus();
});

clearBtn.addEventListener("click", e => {
    e.preventDefault();
    while (list.firstChild) list.removeChild(list.lastChild);
    arrayCities = new Array();
    localStorage.setItem('listCities', '');
    clearBtn.style.display = "none";
    msg.textContent = "";
})

function initialize() {
    arrayCities = localStorage.getItem('listCities').split("_");
    for (city of arrayCities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const { main, name, sys, weather } = data;
                const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                    weather[0]["icon"]
                }.svg`;

                const li = document.createElement("li");
                li.classList.add('city');
                const markup = `
                    <h2 class = "city-name" data-name="${name},${sys.country}">
                        <span>${name}</span>
                        <sup>${sys.country}</sup>
                    </h2>
                    <div class="city-temp">
                    ${Math.round(main.temp)}<sup>°C</sup>
                    </div>
                    <figure>
                        <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                        <figcaption>${weather[0]["description"]}</figcaption>
                    </figure>
                `;
                li.innerHTML = markup;
                list.appendChild(li);
                arrayCities.push(`${name},${sys.country}`);
                clearBtn.style.display = "block";
            })
            .catch (error => {
                msg.textContent = "Please search for a valid city";
                console.log(error.message);
            });
    }
}
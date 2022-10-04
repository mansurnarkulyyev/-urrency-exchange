const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    //currency_code in country_list//currency_code = берем с country_list
    for(let currency_code in country_list){
       
        let selected = i === 0 ? currency_code === "USD" ? "selected" : "" : currency_code === "NPR" ? "selected" : "";
       
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // вставка тега параметров внутри тега select HTML
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // вызов loadFlag с передачей целевого элемента в качестве аргумента
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code === element.value){ // если код валюты списка стран равен значению опции
            let imgTag = element.parentElement.querySelector("img"); // выбор тега img определенного выпадающего списка
            // передача кода страны выбранного кода валюты в URL-адресе img
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); 
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; 
    fromCurrency.value = toCurrency.value; 
    toCurrency.value = tempCode; 
    loadFlag(fromCurrency); // вызов loadFlag с передачей элемента select (fromCurrency) FROM
    loadFlag(toCurrency); 
    getExchangeRate(); 
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    // если пользователь не вводит какое-либо значение или вводит 0, тогда мы поместим 1 значение по умолчанию в поле ввода.
    if(amountVal === "" || amountVal === "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/17d48ea1bc9764dde6642fc5/latest/${fromCurrency.value}`;
    // получение ответа API и возврат его с разбором в js obj, а затем в другой метод, получающий этот объект
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value]; // получение пользователем выбранного курса валюты TO
        let totalExRate = (amountVal * exchangeRate).toFixed(2); // умножение введенного пользователем значения на выбранный курс валюты TO
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{ // если пользователь находится в автономном режиме или произошла какая-либо другая ошибка при извлечении данных, тогда будет запущена функция перехвата.
        exchangeRateTxt.innerText = "Something went wrong";
    });
}
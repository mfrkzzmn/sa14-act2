$(document).ready( function () {

    let weatherApiKey = "b4167869d17747d0a1930304240504";
    let exchangeRateApiKey = "eefc355550fffbd31dae6a56";

    $(".dropdown-toggle").dropdown();

    // $('#task1Table').hide();
    $('#task2').hide();

    const task1ButtonColor = document.querySelector("#inp_task1");

    task1ButtonColor.style.setProperty("background", "#c92804");

    $('#inp_task1').click(() => {
        task1ButtonColor.style.setProperty("background", "#c92804");
        $('#task1').show();
        $('#task2').hide();
    });

    $('#inp_task2').click(() => {
        task1ButtonColor.style.setProperty("background", "unset");
        $('#task1').hide();
        $('#task2').show();
    });

    // task 1
    $("#weatherForm").submit( (e) => {
        e.preventDefault();
        let location = $("#location").val();
        let actionurl = "https://api.weatherapi.com/v1/forecast.json?key="+ weatherApiKey +"&q="+ location +"&days=5&aqi=no&alerts=no";

        $('#weatherTable').DataTable().destroy();

        $.ajax({
                url: actionurl,
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    $('#task1Table').show();
                    let forecastData = data.forecast.forecastday;
                    let wdata = [];

                    forecastData.forEach((element) => {
                        let elem = [];
                        var img = new Image();
                        let temp;
                        let weatherConditionIcon = element.day.condition.icon;
                        let weatherConditionText = element.day.condition.text;

                        img.src = "https:"+weatherConditionIcon;

                        elem.push(element.date);
                        temp = element.day.maxtemp_f + "°/" + element.day.mintemp_f + "°";
                        elem.push(temp);
                        elem.push(img);
                        elem.push(weatherConditionText);
                        elem.push(element.day.avghumidity + "%");
                        elem.push(element.day.daily_chance_of_rain + "%");
                        elem.push(element.day.maxwind_mph + " mph");

                        wdata.push(elem);
                    })
                    
                    $('#weatherTable').DataTable( {
                        retrieve: true,
                        destroy: true,
                        data: wdata,
                        columns: [
                            { "title":"date" },
                            { "title":"temperature" },
                            { "title":"weather condition icon" },
                            { "title":"weather condition" },
                            { "title":"humidity" },
                            { "title":"chance of rain" },
                            { "title":"wind speed" }
                        ],
                        
                    });
                }
        });

    });

    let sourceCurrency;
    let destinationCurrency;

    $('#sourceCurrencyDropdown').change((e) => {
        sourceCurrency = $('#sourceCurrencyDropdown').find(":selected").val();
    })

    $('#destinationCurrencyDropdown').change((e) => {
        destinationCurrency = $('#destinationCurrencyDropdown').find(":selected").val();
    })

    // task 2
    $("#currencyConverterForm").submit( (e) => {
        e.preventDefault();
        let amount = $("#exchangeAmount").val();
        let actionurl = "https://v6.exchangerate-api.com/v6/"+ exchangeRateApiKey +"/latest/" + sourceCurrency;

        $.ajax({
                url: actionurl,
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    let rates = data.conversion_rates;
                    let exchange_rate = rates[destinationCurrency];
                    let result = parseFloat(amount) * parseFloat(exchange_rate);
                    let par = "<p>" + amount +" "+ sourceCurrency +" is "+ result +" "+ destinationCurrency +"</p>";

                    $('#task2ExchangeResult').append(par);
                }
        });

    });

} );
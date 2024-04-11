$(document).ready( function () {

    let weatherApiKey = "b4167869d17747d0a1930304240504";

    $('#task1Table').hide();

    $('#inp_task1').click(function(){
        $('#task1').show();
    });

    
    
    // task 1
    $("#weatherForm").submit(function(e) {
        e.preventDefault();
        let location = $("#location").val();
        console.log(location);
        let actionurl = "https://api.weatherapi.com/v1/forecast.json?key="+ weatherApiKey +"&q="+ location +"&days=5&aqi=no&alerts=no";

        $('#weatherTable').DataTable().destroy();

        $.ajax({
                url: actionurl,
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    console.log("success");
                    console.log(data.location)
                    $('#task1Table').show();
                    let forecastData = data.forecast.forecastday;
                    console.log(forecastData)
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

                    console.log(wdata);
                    
                    
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



} );
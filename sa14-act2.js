$(document).ready(function () {

  let weatherApiKey = "b4167869d17747d0a1930304240504";
  let exchangeRateApiKey = "eefc355550fffbd31dae6a56";

  $(".dropdown-toggle").dropdown();
  $('#task2').hide();
  $('#task3').hide();
  $('#task4').hide();
  $('#task5').hide();

  // const task1ButtonColor = document.querySelector("#inp_task1");

  // task1ButtonColor.style.setProperty("background", "#c92804");

  $('#inp_task1').click(() => {
    // task1ButtonColor.style.setProperty("background", "#c92804");
    $('#task1').show();
    $('#task2').hide();
    $('#task3').hide();
    $('#task4').hide();
    $('#task5').hide();
  });

  $('#inp_task2').click(() => {
    // task1ButtonColor.style.setProperty("background", "unset");
    $('#task1').hide();
    $('#task2').show();
    $('#task3').hide();
    $('#task4').hide();
    $('#task5').hide();
  });

  $('#inp_task3').click(() => {
    // task1ButtonColor.style.setProperty("background", "unset");
    $('#task1').hide();
    $('#task2').hide();
    $('#task3').show();
    $('#task4').hide();
    $('#task5').hide();
  });

  $('#inp_task4').click(() => {
    // task1ButtonColor.style.setProperty("background", "unset");
    $('#task1').hide();
    $('#task2').hide();
    $('#task3').hide();
    $('#task4').show();
    $('#task5').hide();
  });

  $('#inp_task5').click(() => {
    // task1ButtonColor.style.setProperty("background", "unset");
    $('#task1').hide();
    $('#task2').hide();
    $('#task3').hide();
    $('#task4').hide();
    $('#task5').show();
  });

  // task 1
  $("#weatherForm").submit((e) => {
    e.preventDefault();
    let location = $("#location").val();
    let actionurl = "https://api.weatherapi.com/v1/forecast.json?key=" + weatherApiKey + "&q=" + location + "&days=5&aqi=no&alerts=no";

    $('#weatherTable').DataTable().destroy();

    $.ajax({
      url: actionurl,
      type: 'get',
      dataType: 'json',
      success: function (data) {
        $('#task1Table').show();
        let forecastData = data.forecast.forecastday;
        let wdata = [];

        forecastData.forEach((element) => {
          let elem = [];
          var img = new Image();
          let temp;
          let weatherConditionIcon = element.day.condition.icon;
          let weatherConditionText = element.day.condition.text;

          img.src = "https:" + weatherConditionIcon;

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

        $('#weatherTable').DataTable({
          retrieve: true,
          destroy: true,
          data: wdata,
          columns: [
            { "title": "date" },
            { "title": "temperature" },
            { "title": "weather condition icon" },
            { "title": "weather condition" },
            { "title": "humidity" },
            { "title": "chance of rain" },
            { "title": "wind speed" }
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
  $("#currencyConverterForm").submit((e) => {
    e.preventDefault();
    let amount = $("#exchangeAmount").val();
    let actionurl = "https://v6.exchangerate-api.com/v6/" + exchangeRateApiKey + "/latest/" + sourceCurrency;

    $.ajax({
      url: actionurl,
      type: 'get',
      dataType: 'json',
      success: function (data) {
        let rates = data.conversion_rates;
        let exchange_rate = rates[destinationCurrency];
        let result = parseFloat(amount) * parseFloat(exchange_rate);
        let par = "<p>" + amount + " " + sourceCurrency + " is " + result + " " + destinationCurrency + "</p>";

        $('#task2ExchangeResult').append(par);
      }
    });

  });

  //task 3
  var $newTask = $("#new-task");
  var $todoTasks = $("#todo-tasks");
  var $addButton = $("#add-button");

  //generate a new list item
  var makeNewListItem = function (taskToAdd) {

    var $newListItem = $("<li></li>");
    // var $newCheckbox = $("<input type='checkbox' class='checkbox'>");
    var $newLabel = $("<label></label>");
    var $newEditInput = $("<input type='text' class='edit-text hide-edit-input'>");
    var $newEditButton = $("<button class='edit-button'>Edit</button>");
    var $newDeleteButton = $("<button class='delete-button'>Delete</button>");

    $newListItem.append($newLabel.html(taskToAdd))
      .append($newEditInput)
      .append($newEditButton)
      .append($newDeleteButton);

    return $newListItem;
  }

  //add new list item to To-Do list when add-button is clicked.
  $addButton.on("click", function () {
    //the value of the new task is passed as an argument in the makeNewListItem function; a new list item is returned and stored as the variable of listItemToAdd
    var listItemToAdd = makeNewListItem($newTask.val());
    //append the new list item to the "To Do" list 
    $todoTasks.append(listItemToAdd);
    //clears the text in the "add item" input after task is added
    $newTask.val("");
  })

  //remove a task from the "To-Do" list when the delete button is clicked
  $todoTasks.on("click", ".delete-button", function () {
    $(this).parent().remove();
  })

  //function to edit tasks
  var editTask = function (list, input, label) {
    //if the list has the class of edit mode
    if (list.hasClass("editMode")) {
      //removes "editMode" class 
      list.removeClass("editMode");
      input.addClass("hide-edit-input");
      //makes the label's text the same as the input value
      label.text(input.val());
    } else {
      //adds the "editMode" class
      list.addClass("editMode");
      input.removeClass("hide-edit-input");
      //makes the input's value the same as the label's text 
      input.val(label.text());
    }
  }

  //when you click on the "edit button" in the "To-Do" list.... 
  $todoTasks.on("click", ".edit-button", function () {
    //the list of the clicked on task
    var $list = $(this).parent();
    //the input of the clicked on task
    var $input = $(this).prev();
    //the label of the clicked on task
    var $label = $input.prev();
    //the list, input, and label are passed to the editTask function
    editTask($list, $input, $label);
  })



  //task4
  $("#validationForm").submit((e) => {
    e.preventDefault();

    let error_free=true;
    let email_pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
    let password_regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    


    let username = $('#username').val();
    let email = $('#email').val();
    let password = $('#password').val();

    // username validation
    if(username === ""){
      $('#usernameError').empty();
      $('#usernameError').removeClass("error").addClass("error_show");
      $('#usernameError').append("username cannot be empty");
      error_free=false;
    } else if(username.length < 6){
      $('#usernameError').empty();
      $('#usernameError').removeClass("error").addClass("error_show");
      $('#usernameError').append("username should be at least 6 characters long");
      error_free=false;
    } else{
      $('#usernameError').empty();
      $('#usernameError').removeClass("error_show").addClass("error");
    }

    // email validation
    if(email === ""){
      $('#emailError').empty();
      $('#emailError').removeClass("error").addClass("error_show");
      $('#emailError').append("email cannot be empty");
      error_free=false;
    } else if(!email_pattern.test(email)){
      $('#emailError').empty();
      $('#emailError').removeClass("error").addClass("error_show");
      $('#emailError').append("enter a valid email address");
      error_free=false;
    } else{
      $('#emailError').empty();
      $('#emailError').removeClass("error_show").addClass("error");
    }

    // password validation
    if(password === ""){
      $('#passwordError').empty();
      $('#passwordError').removeClass("error").addClass("error_show");
      $('#passwordError').append("password cannot be empty");
      error_free=false;
    } else if(!password_regex.test(password)){
      $('#passwordError').empty();
      $('#passwordError').removeClass("error").addClass("error_show");
      $('#passwordError').append(" password must be at least 8 characters long and contains at least one capital letter and one number");
      error_free=false;
    } else{
      $('#passwordError').empty();
      $('#passwordError').removeClass("error_show").addClass("error");
    }

    if (error_free){
      $('#validationSuccess').empty();
      $('#validationSuccess').removeClass("success").addClass("success_show");
      $('#validationSuccess').append("Form is ready to submit");
    } else {
      $('#validationSuccess').empty();
      $('#validationSuccess').removeClass("success_show").addClass("success");
    }
   
  })

});
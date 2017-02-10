$(function() {

  // Global variables for food search list, budget list,
  // calories needed, and calories budgeted
  var foodBudget = [];
  var foodOptions = [];
  var budgetCalories = 0;
  var bmr = 0;

  // Event handler for calculating caloric needs
  $('.caloric-needs').submit(function(event) {
    event.preventDefault();
    var age = Number($('.age').val());
    var weight = Number($('.weight').val());
    var height = Number($('.height').val());
    var gender = $('input[name=optionsRadios]:checked').val();
    var activityLevel = $('.activity-level').val();

    // Adjust caloric needs for gender
    switch (gender) {
      case 'Male':
        bmr = 10 * weight * .453592 + 6.25 * 2.54 * height - 5 * age + 5;
        break;
      case 'Female':
        bmr = 10 * weight * .453592 + 6.25 * 2.54 * height - 5 * age - 161;
        break;
    }

    // Adjust caloric needs for activity level
    switch (activityLevel) {
      case 'Not active':
        bmr *= 1.2;
        break;
      case 'Somewhat active':
        bmr *= 1.375;
        break;
      case 'Moderately active':
        bmr *= 1.55;
        break;
      case 'Very active':
        bmr *= 1.95;
        break;
    }

    // Display step 2 (food search) and disable caloric needs calculator
    bmr = Math.floor(bmr);
    $('.cal-result article').remove();
    $('.cal-result').append('<article  class="col-md-4"><h3>Calories Needed: ' +
      bmr + '</h3></article>');
    $('.search-section').css('visibility', 'visible');
    $('.reset-button').css('visibility', 'visible');
    $('#optionsRadios1').prop('disabled', true);
    $('#optionsRadios2').prop('disabled', true);
    $('.height').prop('disabled', true);
    $('.weight').prop('disabled', true);
    $('.age').prop('disabled', true);
    $('.activity-level').prop('disabled', true);
    $('.calculate').prop('disabled', true);
  })

  // Event handler that searches Nutritionix for food items
  $('.search-form').submit(function(event) {
    event.preventDefault();
    foodOptions = [];
    $('.nutri-list option').remove();
    var $foodSearchString = $('.food-search').val();
    var $searchURL = 'https://api.nutritionix.com/v1_1/search/' + $foodSearchString
        + '?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=d7341606&appKey=a15d50215caa0a9bd0293e425eb42128';

    // Send AJAX GET request to Nutritionix API and return a list of options
    $.get($searchURL)
      .then(function(data, status) {
        for (var i in data.hits) {
          foodOptions.push({brand: data.hits[i].fields.brand_name, item: data.hits[i].fields.item_name,
                           calories: Math.floor(data.hits[i].fields.nf_calories)});
          var foodString = data.hits[i].fields.brand_name + ' ' + data.hits[i].fields.item_name + ', ' +
                      Math.floor(data.hits[i].fields.nf_calories) + ' cal';
          $('.nutri-list').append('<option class="results-item" value="' + foodString + '">' + foodString + '</option>' );
        }
      })
      .catch(function(status) {
        alert(status);
      })
  })

  // Event handler for adding an item to food budget
  $('.add').on('click', function(event) {
    event.preventDefault();
    var itemIndex = $('.nutri-list option:selected').index();
    var item = $('.nutri-list').val();
    $('.budget-list').append('<option class="budget-item" value="' + item + '">' + item + '</option>');
    foodBudget.push(foodOptions[itemIndex]);
    budgetCalories += foodOptions[itemIndex].calories;
    $('.print-button').css('visibility', 'visible');
    $('.calorie-result article').remove();
    if (budgetCalories > bmr) {
      $('.calorie-result').append('<article  class="col-md-4"><h3 style="color:rgb(223, 104, 0);">Calories Budgeted: ' +
        budgetCalories + '</h3></article>');
    } else {
      $('.calorie-result').append('<article  class="col-md-4"><h3>Calories Budgeted: ' +
        budgetCalories + '</h3></article>');
    }
  })

  // Event handler for removing an item from food budget
  $('.remove').on('click', function(event) {
    event.preventDefault();
    var budgetItemIndex = $('.budget-list option:selected').index();
    if (budgetItemIndex !== -1) {
      budgetCalories -= foodBudget[budgetItemIndex].calories;
      foodBudget.splice(budgetItemIndex, 1);
      $('.budget-list option:selected').remove();
      $('.calorie-result article').remove();
      if (budgetCalories > bmr) {
        $('.calorie-result').append('<article  class="col-md-4"><h3 style="color:rgb(223, 104, 0);">Calories Budgeted: ' +
          budgetCalories + '</h3></article>');
      } else {
        $('.calorie-result').append('<article  class="col-md-4"><h3>Calories Budgeted: ' +
          budgetCalories + '</h3></article>');
      }
    }
  })

  // Event handler for resetting the form
  $('.reset-button').on('click', function(event) {
    event.preventDefault();
    foodBudget = [];
    foodOptions = [];
    budgetCalories = 0;
    bmr = 0;
    $('#optionsRadios1').prop('disabled', false);
    $('#optionsRadios2').prop('disabled', false);
    $('.height').prop('disabled', false);
    $('.weight').prop('disabled', false);
    $('.age').prop('disabled', false);
    $('.activity-level').prop('disabled', false);
    $('.calculate').prop('disabled', false);
    $('.height').prop('selectedIndex',0);
    $('.weight').prop('selectedIndex',0);
    $('.age').prop('selectedIndex',0);
    $('.activity-level').prop('selectedIndex',0);
    $('.calorie-result article').remove();
    $('.cal-result article').remove();
    $('.budget-list option').remove();
    $('.nutri-list option').remove();
    $('.food-search').val('');
    $('.search-section').css('visibility', 'hidden');
    $('.reset-button').css('visibility', 'hidden');
    $('.print-button').css('visibility', 'hidden');
  })

  // Event handler for adding an item to food budget via double click
  $('.nutri-list').on('dblclick', 'option', function() {
    var itemIndex = $('.nutri-list option:selected').index();
    var item = $('.nutri-list').val();
    $('.budget-list').append('<option class="budget-item" value="' + item + '">' + item + '</option>');
    foodBudget.push(foodOptions[itemIndex]);
    budgetCalories += foodOptions[itemIndex].calories;
    $('.print-button').css('visibility', 'visible');
    $('.calorie-result article').remove();
    if (budgetCalories > bmr) {
      $('.calorie-result').append('<article  class="col-md-4"><h3 style="color:rgb(223, 104, 0);">Calories Budgeted: ' +
        budgetCalories + '</h3></article>');
    } else {
      $('.calorie-result').append('<article  class="col-md-4"><h3>Calories Budgeted: ' +
        budgetCalories + '</h3></article>');
    }
  })

  // Event handler for removing an item from food budget via double click
  $('.budget-list').on('dblclick', 'option', function() {
    var budgetItemIndex = $('.budget-list option:selected').index();
    if (budgetItemIndex !== -1) {
      budgetCalories -= foodBudget[budgetItemIndex].calories;
      foodBudget.splice(budgetItemIndex, 1);
      $('.budget-list option:selected').remove();
      $('.calorie-result article').remove();
      if (budgetCalories > bmr) {
        $('.calorie-result').append('<article  class="col-md-4"><h3 style="color:rgb(223, 104, 0);">Calories Budgeted: ' +
          budgetCalories + '</h3></article>');
      } else {
        $('.calorie-result').append('<article  class="col-md-4"><h3>Calories Budgeted: ' +
          budgetCalories + '</h3></article>');
      }
    }
  })

  // Event handler for printing caloric needs and budget
  $('.print-button').on('click', function(event) {
    event.preventDefault();
    $('.print p').remove();
    $('.print article').remove();
    $('.print').append('<h3 class="printed">NutriBudget</h3>');
    $('.print').append('<br><p class="printed">Gender: ' + $('input[name=optionsRadios]:checked').val() + '</p>');
    $('.print').append('<p class="printed">Height: ' + $('.height option:selected').text() + '</p>');
    $('.print').append('<p class="printed">Weight: ' + $('.weight').val() + ' lb</p>');
    $('.print').append('<p class="printed">Age: ' + $('.age').val() + '</p>');
    $('.print').append('<p class="printed">Activity Level: ' + $('.activity-level').val() + '</p><br>');
    $('.print').append('<article  class="printed"><h4 class="printed">Calories Needed: ' +
      bmr + '</h4></article>');
    $('.print').append('<article  class="printed"><h4 class="printed">Calories Budgeted: ' +
      budgetCalories + '</h4></article><br>');
    // $('.budget-list > option').each(function() {
    //   $('.print').append('<p class="printed">' + this.value + '<p>');
    // })
    $('.print-tbl').append('<tr class="printed"><th class="printed">Food</th><th class="printed">Calories</th></tr>');
    for (var i = 0; i < foodBudget.length; i++) {
      $('.print-tbl').append('<tr class="printed"><td class="printed">' + foodBudget[i].brand + ' ' + foodBudget[i].item + '</td><td class="printed">'
        + foodBudget[i].calories + '</td></tr>');
    }
    window.print();
    $('.print').empty();
    $('.print-tbl').empty();
  })
})

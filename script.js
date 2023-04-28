
// **For women**, BMR = 655.1 + (9.563 x weight in kg) + (1.850 x height in cm) - (4.676 x age in years)
// **For men**, BMR = 66.47 + (13.75 x weight in kg) + (5.003 x height in cm) - (6.755 x age in years)
// light=1, moderate=2, active=3
const height = document.getElementById("height").value;
const weight = document.getElementById("weight").value;
const age = document.getElementById("age").value;
const gender = document.getElementById("gender").value;
const activity = document.getElementById("activityLevel").value;
const btn = document.getElementById("generateMeal");
const cardContainer = document.getElementById("mealList");
const menBmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
const womenBmr = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
let bmr, calorieRequirement;


btn.addEventListener("click", async () => {
  bmr = gender == 'male' ? menBmr : womenBmr;
  if (activity == 1) { calorieRequirement = bmr * 1.375; } else if (activity == 2) { calorieRequirement = bmr * 1.55; } else { calorieRequirement = bmr * 1.725; }
  try {
    const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=9403db19a1954f83a2ba315479b46747&timeFrame=day&targetCalories=${calorieRequirement}`);
    const data = await response.json();
    console.log(data);
    let html = "";
    let calorii = data.nutrients.calories;
    if (data.meals) {
      let count = 0;
      data.meals.forEach(async (meal) => {
        const mealImage = await getMealImage(meal.id);
        let mealFor = "";
        if (count === 0) {
          mealFor = "BREAKFAST";
        }
        if (count === 1) {
          mealFor = "LUNCH";
        }
        if (count === 2) {
          mealFor = "DINNER";
        }
        html += `<div class="card-wrapper" data-id="${meal.id}">
                  <h2>${mealFor}</h2>
                  <div class="card">
                      <img src="${mealImage}" alt="Placeholder Image">
                      <div class="card-content">
                          <h3>${meal.title}</h3>
                          <p>Calories : ${calorii}</p>
                          <button class="button getRec" onClick="getMeal(${meal.id})">Get Recepi</button>
                      </div>
                  </div>
              </div>`;
        cardContainer.innerHTML = html;
        count++;
      });
    }
  } catch (error) { console.log("error"); }
});

function getMeal(mealId){
  getMealDetails(mealId);
  getSteps(mealId);
  getEquipment(mealId);
}


async function getMealImage(mealId) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${mealId}/information?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`);
    const data = await response.json();
    return data.image;
  } catch (error) {
    console.log("error");
  }
}

function getMealDetails(mealId) {
  fetch(`https://api.spoonacular.com/recipes/${mealId}/information?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`)
    .then(response => response.json())
    .then(data => {
      if (data.extendedIngredients) {
        html = `<table class="tbl-class">`;
        data.extendedIngredients.forEach(async (ingredients) => {
            html+= `<tr><td>${captilize(ingredients.nameClean)}</td><td>${ingredients.amount+" "+ingredients.unit}</td><tr>`;
        })
        html += `</table>`;
        document.getElementById("ingredient").innerHTML = html;
      }
    })
    .catch(error => {
      console.log("error");
    });
}


function getEquipment(mealId) {
  fetch(`https://api.spoonacular.com/recipes/${mealId}/equipmentWidget.json?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`)
    .then(response => response.json())
    .then(data => {
      if (data.equipment) {
        html = `<ul class="ulist">`;
        data.equipment.forEach(async (equipment) => {
            html += `<li>${equipment.name}</li>`;
        })
        html+=`</ul>`;
        document.getElementById("equipment").innerHTML = html;
      }
    })
    .catch(error => {
      console.log("error");
    });
}

function getSteps(mealId){

  fetch(`https://api.spoonacular.com/recipes/${mealId}/analyzedInstructions?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`)
  .then(response => response.json())
  .then(data => {
    if (data[0].steps) {
      html =`<ol class="ulist">`
    data[0].steps.forEach(async (step) => {
      html +=`<li>${step.step}</li>`;
    })
    html += `</ol>`;
    document.getElementById("steps").innerHTML = html;
  }
  })
  .catch(error => {
    console.log("error");
  });
}




function captilize (e) {
  var array=e.split(" ");
  console.log(array);
  // e = e.slice(0,1).toUpperCase() + e.slice(1);
  for(var i=0;i<array.length;i++) {
    array[i] = array[i].slice(0,1).toUpperCase() + array[i].slice(1);
    console.log(array[i]);
  }
  const result=array.join(" ");
  return result;
  
  }

function openTab(evt, cityName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) 
  {
     x[i].style.display = "none"; 
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
     tablinks[i].className = tablinks[i].className.replace(" w3-red", ""); 
    }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " w3-red";
}
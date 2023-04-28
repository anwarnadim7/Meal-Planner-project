// **For women**, BMR = 655.1 + (9.563 x weight in kg) + (1.850 x height in cm) - (4.676 x age in years)
// **For men**, BMR = 66.47 + (13.75 x weight in kg) + (5.003 x height in cm) - (6.755 x age in years)
// light=1, moderate=2, active=3

//test api 1 - af72b9d2cfe44609bbb3a13124416e90
//test api 2 - d45a3b62b79a4bdcb94e4fc1d972cac1
//test api 3 - 9403db19a1954f83a2ba315479b46747

const btn = document.getElementById("generateMeal");
const cardContainer = document.getElementById("mealList");
const loader = document.getElementById("loader");
const mealIngredients = document.getElementById("mealIngredient");
const error_display = document.getElementById("err");
let detailsBox =document.getElementById("details-box");

detailsBox.style.display="none";
error_display.style.display="none";
loader.style.display = "none";
const mealForm=document.getElementById("mealForm");
mealForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let height = document.getElementById("height").value;
    let weight = document.getElementById("weight").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let activity = document.getElementById("activityLevel").value;
    let bmr, calorieRequirement;
    let menBmr = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    let womenBmr = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
    if (height === "" || weight === "" || age === "") {
        error_display.innerHTML="Please enter a height, weight and age values."
        error_display.classList.add("error-disp");
        error_display.style.display = "block";
        setTimeout(function() {
            error_display.style.display = "none";
        }, 5000); 

    } else {
        bmr = gender == "male" ? menBmr : womenBmr;
        if (activity == 1) {
            calorieRequirement = bmr * 1.375;
        }
        else if (activity == 2) {
            calorieRequirement = bmr * 1.55;
        }
        else {
            calorieRequirement = bmr * 1.725;
        }
        try {
            loader.style.display = "block";
            const response = await fetch(
                `https://api.spoonacular.com/mealplanner/generate?apiKey=9403db19a1954f83a2ba315479b46747&timeFrame=day&targetCalories=${calorieRequirement}`
            );
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
            loader.style.display = "none";
        } catch (error) {
            console.log("error");
            loader.style.display = "none";
        }
    }
});

async function getMealImage(mealId) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${mealId}/information?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`
        );
        const data = await response.json();
        return data.image;
    } catch (error) {
        console.log("error");
    }
}

function getMeal(mealId) {
    getMealDetails(mealId);
    getSteps(mealId);
    getEquipment(mealId);
    detailsBox.style.display="block";
}

function getMealDetails(mealId) {
    fetch(
        `https://api.spoonacular.com/recipes/${mealId}/information?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.extendedIngredients) {
                html = `<table class="tbl-class">`;
                data.extendedIngredients.forEach(async (ingredients) => {
                    html += `<tr><td>${capitalize(ingredients.nameClean)}</td><td>${ingredients.amount + " " + ingredients.unit
                        }</td><tr>`;
                });
                html += `</table>`;
                document.getElementById("ingredient").innerHTML = html;
            }
        })
        .catch((error) => {
            console.log("error");
        });
}

function getEquipment(mealId) {
    fetch(
        `https://api.spoonacular.com/recipes/${mealId}/equipmentWidget.json?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.equipment) {
                html = `<ul class="ulist">`;
                data.equipment.forEach(async (equipment) => {
                    html += `<li>${equipment.name}</li>`;
                });
                html += `</ul>`;
                document.getElementById("equipment").innerHTML = html;
            }
        })
        .catch((error) => {
            console.log("error");
        });
}

function getSteps(mealId) {
    fetch(
        `https://api.spoonacular.com/recipes/${mealId}/analyzedInstructions?apiKey=9403db19a1954f83a2ba315479b46747&includeNutrition=false`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data[0].steps) {
                html = `<ol class="ulist">`;
                data[0].steps.forEach(async (step) => {
                    html += `<li>${step.step}</li>`;
                });
                html += `</ol>`;
                document.getElementById("steps").innerHTML = html;
            }
        })
        .catch((error) => {
            console.log("error");
        });
}

// function captilize (e) {
//   var array=e.split(" ");
//   console.log(array);
//   // e = e.slice(0,1).toUpperCase() + e.slice(1);
//   for(var i=0;i<array.length;i++) {
//     array[i] = array[i].slice(0,1).toUpperCase() + array[i].slice(1);
//     console.log(array[i]);
//   }
//   const result=array.join(" ");
//   return result;

//   }

function capitalize(string) {
    const words = string.toLowerCase().split(" ");
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
}

function openTab(evt, data) {
    var i, x, tablinks;
    x = document.getElementsByClassName("data");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(data).style.display = "block";
    evt.currentTarget.className += " w3-red active";
}
var firstTablink = document.getElementsByClassName("tablink")[0];
var firstData = document.getElementsByClassName("data")[0];
firstTablink.className += " w3-red active";
firstData.style.display = "block";


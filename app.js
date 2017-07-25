"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  var person;
  var searchResult;
  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
        person = searchByName(people);
    break;
    case 'no':
        searchResult = searchByTrait(people);
        person = searchResult[0];

    break;
    default:
    app(people); // restart app
    break;

  }
  mainMenu(person, people);

}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    // TODO: get person's info
    break;
    case "family":
        getPersonFamily(person, people);
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function getPersonFamily(person, people) {
    var zero = 0;
    var parentsName = "";
    var personParents = [];
    var parentsArray = person.parents;
    if (parentsArray.length !== zero) {
        personParents = people.filter(function(element) {
            if(parentsArray[0] === element.id){
                return true;
            } else if (parentsArray[1] === element.id) {
                return true;
            } else {
                return false;
            }
        })
        var n;
        for (n in personParents) {
            parentsName += personParents[n].firstName;
            parentsName += personParents[n].lastName;
        }
    } else {
        alert("The person doesn't have any parents");
    }

    /*
    var parentsName = "";
    var parentsArray = person[0].parents;
    if (parentsArray.length === 0) {
        alert("the person doesn't have any parents");
    } else {
        for (var i = 0; i < parentsArray.length; i++) {
            for (var n = 0; n < people.length; n++) {
                if(parentsArray[i] === people[n].id) {
                    if(i === parentsArray.length-1 && i !== 0) {
                        parentsName += " and " + people[n].firstName + " ";
                        parentsName += people[n].lastName + ".";
                    } else {
                        parentsName += people[n].firstName + " ";
                        parentsName += people[n].lastName;
                }
            }
        }    
    }
    alert("Parents Name: " + parentsName);
    getSiblings(parentsArray, people);  
    } */      
}

/*
function getSiblings(parentsArray, people) {
    var siblings = []
    for (var i = 0; i < parentsArray.length; i++) {
            siblings = people.filter(function(element){
                if(parentsArray[i] === element.parents[0] || ){
                    return true;
                } else {
                    return false;
                }
            })
    }
    alert(siblings[0].firstName + " " + siblings[0].lastName);
}
*/

function searchByName(people){
  var firstName = promptFor("What is the person's first name?", chars).toLowerCase();
  var lastName = promptFor("What is the person's last name?", chars).toLowerCase();
  var searchResults = people.filter(function(element){
    if (element.lastName.toLowerCase() === lastName && element.firstName.toLowerCase() === firstName){
      return true;
    }
    else {
      return false;
    }
  })
  try{
    console.log(searchResults[0].firstName + " " + searchResults[0].lastName);
    var person = searchResults[0];
    return person;
  }
  catch(err){
    alert("Name entered not found in Database. Try another name or search by traits");
    app(people);
  }
  getPersonFamily(searchResults, people);
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  var personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
function searchByTrait(people){
    var searchParameters;
    var searchResults;
    people = getAge(people)
    searchParameters = getTraitSearchParameters();
    searchResults = searchTraitFilters(searchParameters, people);
    return searchResults;

}
function searchTraitFilters(searchParameters, people){
    var searchResults;
    searchResults = [];
    var parameter;
    var result;
    searchResults = people.filter(function(element){
        for(parameter in searchParameters){
            if (searchParameters[parameter] === element[parameter] || searchParameters[parameter] === "not applicable") {
                result = true;
            }
            else {
                result = false;
                return result;
             }
        }
        return result;
    });
    return searchResults;
}
function getTraitSearchParameters(){
    var searchParameters = {
    }
    searchParameters.age = getIntigerSearchParameter('age');
    searchParameters.height = getIntigerSearchParameter('height');
    searchParameters.weight = getIntigerSearchParameter('weight');
    searchParameters.occupation = getStringSearchParameter('occupation');
    searchParameters.eyeColor = getStringSearchParameter('eye color');
    return searchParameters;
}
function getStringSearchParameter(parameter){
    var userChoice = prompt("Would you like to search for " + parameter + "?", "yes or no").toLowerCase();
    if (userChoice === "yes") {
        var selectedParameter;
        selectedParameter = prompt("Enter " + parameter ).toLowerCase();
        return selectedParameter;
    }
    else if (userChoice === "no"){
        return "not applicable";
    }
    else {
        alert("Input not recognized. Please select yes or no ");
        getStringSearchParameter(parameter);
    }
}
function getIntigerSearchParameter(parameter){
    var userChoice = prompt("Would you like to search for " + parameter , "yes or no").toLowerCase();
    if (userChoice === "yes") {
        var selectedParameter;
        selectedParameter = Number(prompt("Enter " + parameter));
            if (!isNaN(selectedParameter)){                                                         // this if/else statement checks to see if the user entered a number and corrects them if not
                return selectedParameter;
            }
            else{                                                                                  
                alert("Entry Not recognized. Please enter " + parameter + " as a integer number");
                getIntigerSearchParameter(parameter);
            }
    }
    else if (userChoice === "no"){
        return "not applicable";
    }
    else{
        alert("Input not recognized. Please select yes or no ");
        getIntigerSearchParameter(parameter);
    }
}
function getAge(people){
    people = people.map(function(element){
        element.dob = reorderDate(element.dob);
        element.age = subtractDates(element.dob);
        return element;
    })
    return people;
}
function reorderDate(date){
    var placeholder;
    placeholder = date.split("/");
    var year;
    var month;
    var day;
    year = placeholder[2];
    day = placeholder[1];
    month = placeholder [0];
    placeholder = [year, month, day];
    var date = placeholder.join("/");
    return date;
}
function subtractDates(dob){
    var currentDate;
    var birthday;
    var age;
    currentDate = new Date();
    birthday = new Date(dob);
    age = Math.abs(currentDate.getTime() - birthday.getTime());
    age = Math.floor(age / 31556952000);
    return age;
}
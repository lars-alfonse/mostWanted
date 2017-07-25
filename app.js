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
        person = searchResult;

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
        getPersonInfo(person);
    break;
    case "family":
        getPersonFamily(person, people);
    break;
    case "descendants":
        getdescendants(person, people);
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

/*
The function will find if the person has any parents, collect the their parents object
then output the parents first and last name
*/
function getPersonFamily(person, people) {
    var zero = 0;
    var one = 1;
    var parentsName = "";
    var personId = person.id;
    var personWithParents = [];
    var personParentsArray = person.parents;
    if (personParentsArray.length !== zero) {
        personWithParents = people.filter(function(element) {
            if(personParentsArray[zero] === element.id){
                return true;
            } else if (personParentsArray[one] === element.id) {
                return true;
            } else {
                return false;
            }
        })
        parentsName = getNames(personWithParents);
        alert("The person parent: " + parentsName);
        getSiblings(personParentsArray, personId, people);
    } else {
        alert("The person doesn't have any parents");
    }
    getCurrentSpouse(person, people);    
}

/*
the function will loop to find the person siblings and output the results
*/
function getSiblings(personParentsArray, personId, people) {
    var siblings = []
    var zero = 0;
    var one = 1;

    for (var i = 0; i < personParentsArray.length; i++) {
            var temporarySiblings = people.filter(function(element){
                if(personParentsArray[i] === element.parents[zero] || personParentsArray[i] === element.parents[one]) {
                    if (siblings.includes(element) || personId === element.id) {
                        return false;
                    } else {
                        return true;
                    }
                    return true;
                } else {
                    return false;
                }
            })
            for(var j = 0; j < temporarySiblings.length; j++){
                siblings.push(temporarySiblings[j]);

            }
    }
    var siblingsName = "";
    if (siblings.length !== zero) {
        siblingsName = getNames(siblings);
        alert("Siblings names: " + siblingsName);
    } else {
        alert("Person doesn't have siblings");
    }
}

/*
The function will test if the person has a sopouse and 
loop to find the spounse then output the results. 
*/
function getCurrentSpouse(person, people) {
    var isNull = null;
    var personSpouse = person.currentSpouse;
    var spouseName = "";
    var spouse;
    if (personSpouse !== isNull) {
        spouse = people.filter(function(element){
            if (personSpouse === element.id) {
                return true;
            } else {
                return false;
            }
        })
        spouseName = getNames(spouse);
        alert("The person current spouse is: " + spouseName);
    } else {
        alert("Person doesn't have a spouse.");
    }

}


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
   // alert(searchResults[0].firstName + " " + searchResults[0].lastName);
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
function searchByTrait(people){ //function searches by trait
    var peopleWithAge;
    var searchParameters;
    var searchResults;
    peopleWithAge = getAge(people)
    searchParameters = getTraitSearchParameters();
    searchResults = searchTraitFilters(searchParameters, people);
    searchResults = narrowDownResults(searchResults, people);
    return searchResults;

}
function searchTraitFilters(searchParameters, people){ //this function uses filter to only have matched results
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
function getTraitSearchParameters(){ //this function prompts user for their search parameters
    var searchParameters = {
    }
    searchParameters.age = getIntigerSearchParameter('age');
    searchParameters.height = getIntigerSearchParameter('height');
    searchParameters.weight = getIntigerSearchParameter('weight');
    searchParameters.occupation = getStringSearchParameter('occupation');
    searchParameters.eyeColor = getStringSearchParameter('eye color');
    if (checkSearchParameters(searchParameters)){
    return searchParameters;
    }
    else{
        alert("Please select at least 2 search parameters.")
        searchParameters = getTraitSearchParameters();
        return searchParameters;
    }
}
function checkSearchParameters(searchParameters){ //this function checks if enough search parameters are selected
    var listedSearchParameters = Object.values(searchParameters);
    var count;
    count = wordCount(listedSearchParameters);
    if(count["not applicable"] > 3) {
        return false;
    }
    else{
        return true;
    }
}
function wordCount(words) {
    var countedWords;       
    countedWords = words.reduce( (countWords, word) => {
        countWords[word] = ++countWords[word] || 1;
        return countWords;
    }, {});
    return countedWords;
}
function getStringSearchParameter(parameter){ //this is how string parameters are captured
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
       selectedParameter =  getStringSearchParameter(parameter);
       return selectedParameter;
    }
}
function getIntigerSearchParameter(parameter){ // this is how number value parameters are captured
    var userChoice = prompt("Would you like to search for " + parameter , "yes or no").toLowerCase();
    if (userChoice === "yes") {
        var selectedParameter;
        selectedParameter = Number(prompt("Enter " + parameter));
            if (!isNaN(selectedParameter)){                                                         // this if/else statement checks to see if the user entered a number and corrects them if not
                return selectedParameter;
            }
            else{                                                                                  
                alert("Entry Not recognized. Please enter " + parameter + " as a integer number");
                selectedParameter = getIntigerSearchParameter(parameter);
                return selectedParameter;
            }
    }
    else if (userChoice === "no"){
        return "not applicable";
    }
    else{
        alert("Input not recognized. Please select yes or no ");
       selectedParameter =  getIntigerSearchParameter(parameter);
       return selectedParameter;
    }
}
function getAge(people){ // this creates a seperate array of people with their ages added
    var peopleWithAge
    peopleWithAge = people.map(function(element){
        element.dob = reorderDate(element.dob);
        element.age = subtractDates(element.dob);
        return element;
    })
    return peopleWithAge;
}
function reorderDate(date){ //this function moves the date entered in data base to yyyy/mm/dd format
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
function subtractDates(dob){ // this function subtracts dob from todays date to get age as a number
    var currentDate;
    var birthday;
    var age;
    currentDate = new Date();
    birthday = new Date(dob);
    age = Math.abs(currentDate.getTime() - birthday.getTime());
    age = Math.floor(age / 31556952000);
    return age;
}
function getdescendants(person, people){ //this function gathers descendent information
    var descendants;
    var identification;
    identification = person.id;
    descendants = [];
    descendants = searchByParentId(identification, people);
    console.log(descendants);
    reportDescendants(descendants, person);
    return descendants;
}
function searchByParentId(identification, people){ //this function filters people by the id's of person search for
    var descendants;
    descendants = people.filter(function(element){
        if (element.parents[0] === identification || element.parents[1] === identification){
            return true;
        }
        else {
            return false;
        }
    });
    if (descendants.length > 0) {
        var descendantsdescendants;
        for (var i = 0; i < descendants.length; i++) {
            descendantsdescendants = searchByParentId(descendants[i].id, people); //if there are descendants it calls the function for each descendant
        }
    }
    if (descendantsdescendants){
    descendants.push(descendantsdescendants);
    }
    return descendants;
}
function reportDescendants(descendants, person){ //this function reports if descendants are found in alert boxes
    var descendantsNames
    descendantsNames = getNames(descendants);
    if (!descendants[0]) { //checks if there are descendants
        alert(person.firstName + ' ' + person.lastName + " has no descendants on file.");
    }
    else{
        alert(person.firstName + ' ' + person.lastName + " has descendants: " + descendantsNames);
    }
    return descendants;
}
function getNames(selectedGroup){ //this function gathers names for alert boxes
    var groupNames;
    groupNames = selectedGroup.map(function(element){
        return element.firstName + " " + element.lastName
    });
    groupNames = groupNames.join("; ");
    return groupNames;
}
function narrowDownResults(searchResults, people){ //this function allows for the user to select one out of a list of search results
    var resultNames;
    var userChoice;
    if (searchResults.length > 1){
        resultNames = getNames(searchResults);
        alert("Several people found please type the name of the individual you are searching for");
        alert("People found: " + resultNames);
        userChoice = searchByName(people); //call search by name function after displaying results. can search for any name;
    }
    else{
        userChoice = searchResults[0];
    }
    return userChoice;
}
function getPersonInfo(person){
    var trait;
    for(trait in person){
        console.log(person.trait);
    }
}
"use strict"
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
            app(people);
        break;
    }
    mainMenu(person, people);
}
function mainMenu(person, people){
    if(!person){
        alert("Could not find that individual.");
        return app(people);
    }
    var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");
    switch(displayOption){
        case "info":
            getPersonInfo(person, people);
        break;
        case "family":
            getPersonFamily(person, people);
        break;
        case "descendants":
            getDescendants(person, people);
            mainMenu(person, people);
        break;
        case "restart":
            app(people);
        break;
        case "quit":
            return;
        default:
            return mainMenu(person, people);
    }
}

/*
The function will find if the person has any parents, collect their parents object
then output the parents first and last name
*/
function getPersonFamily(person, people) {
    var parents = getPersonParents(person, people);
    var siblings = getPersonSiblings(person, people);
    var currentSpouse = getPersonCurrentSpouse(person, people);
    var children = getPersonChildren(person, people); 
    outputPersonFamilyResults(person, parents, siblings, currentSpouse, children); 
    mainMenu(person, people);  
}

function getPersonParents(person, people) {
    var zero = 0;
    var one = 1;
    var parentsName = "";   
    var personWithParents = [];
    var personParentsArray = person.parents;
    if (personParentsArray.length !== zero) {
        personWithParents = searchForPersonParents(personParentsArray, people);
        parentsName = getNames(personWithParents);
    } else {
        parentsName = "The person doesn't have any parents";
    } 
    return parentsName;
}

/*
The function will loop to full the person's parents data.
*/
function searchForPersonParents(personParentsArray, people) {
    var zero = 0;
    var one = 1;
    var personWithParents = [];
    personWithParents = people.filter(function(element) {
        if(personParentsArray[zero] === element.id){
            return true;
        } else if (personParentsArray[one] === element.id) {
            return true;
        } else {
             return false;
        }
    });
    return personWithParents;
}

/*
the function will loop to find the person siblings and output the results
*/
function getPersonSiblings(person, people) {
    var zero = 0;
    var one = 1;
    var siblingsName;
    var personParentsArray = person.parents;
    var siblings = []
    for (var i = 0; i < personParentsArray.length; i++) {
        var temporarySiblings = searchForPersonSiblings(personParentsArray[i], siblings, person, people);
        for(var j = 0; j < temporarySiblings.length; j++){
            siblings.push(temporarySiblings[j]);
        }
    }
    siblingsName = outputPersonSiblings(siblings);
    return siblingsName;
} 
 
/*
The function will loop to find the person siblings and return the results
*/
function searchForPersonSiblings(personParentsArray, siblings, person, people) {
    var zero = 0;
    var one = 1;
    var personId = person.id;
    var temporarySiblings = people.filter(function(element){
        if(personParentsArray === element.parents[zero] || personParentsArray === element.parents[one]) {
            if (siblings.includes(element) || personId === element.id) {
                return false;
            } else {
                return true;
            }
            return true;
        } else {
            return false;
        }
    });
    return temporarySiblings;
}

/*
The function will output the person's siblings
*/
function outputPersonSiblings(siblings) {
    var zero = 0;
    var siblingsName = "";
    if (siblings.length !== zero) {
        siblingsName = getNames(siblings);
    } else {
        siblingsName = "Person doesn't have siblings";
    }
    return siblingsName;
}

/*
The function will test if the person has a sopouse and 
loop to find the spounse then output the results. 
*/
function getPersonCurrentSpouse(person, people) {
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
        });
        spouseName = getNames(spouse);
    } else {
        spouseName = "Person doesn't have a spouse.";
    }
    return spouseName;
}

/*
The function will loop to find if the person has any children 
and output the results
*/
function getPersonChildren(person, people) {
    var zero = 0;
    var one = 1;
    var personId = person.id;
    var childrenNames = "";
    var children = people.filter(function(element){
        if (personId === element.parents[zero] || personId === element.parents[one]) {
            return true;
        } else {
            return false;
        }
    });
    if (children.length !== zero) {
        childrenNames = getNames(children);
    } else {
        childrenNames = "The person doesn't have any children";
    }
    return childrenNames;
}

function outputPersonFamilyResults(person, parents, siblings, currentSpouse, children) {
    alert(person.firstName + " " + person.lastName + "\n \n Parents: \n    " + parents + "\n \n Siblings: \n    " + siblings 
            + "\n \n Current Spouse: \n    " + currentSpouse + "\n \n Children: \n    " + children);
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
    });
    try{
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
function promptFor(question, valid){
    do{
        var response = prompt(question).trim();
    } 
    while(!response || !valid(response));
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
    var searchParameters;
    var searchResults;
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
    var searchParameters = {};
    searchParameters.age = getIntegerSearchParameter('age');
    searchParameters.height = getIntegerSearchParameter('height');
    searchParameters.weight = getIntegerSearchParameter('weight');
    searchParameters.occupation = getStringSearchParameter('occupation');
    searchParameters.eyeColor = getStringSearchParameter('eye color');
    return searchParameters;
}

//THESE FUNCTIONS ARE TO RESTRICT PARAMETERS TO 2 MINIMUM REQUIRED!!!!!!!!
/*function checkSearchParameters(searchParameters){ //this function checks if enough search parameters are selected
    var listedSearchParameters = Object.values(searchParameters);
    var count;
    count = wordCount(listedSearchParameters);
    if(count["not applicable"] > 3) {   // if more than three are filled as not applicable the user is reset
        return false;
    }
    else{
        return true;
    }
}
function wordCount(words) { //this function counts the amount of times a parameter is repeated
    var countedWords;       
    countedWords = words.reduce( (countWords, word) => {
        countWords[word] = ++countWords[word] || 1;
        return countWords;
    }, {});
    return countedWords;
}*/
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
function getIntegerSearchParameter(parameter){ // this is how number value parameters are captured
    var userChoice = prompt("Would you like to search for " + parameter , "yes or no").toLowerCase();
    if (userChoice === "yes") {
        var selectedParameter;
        selectedParameter = Number(prompt("Enter " + parameter));
            if (!isNaN(selectedParameter)){                                                         // this if/else statement checks to see if the user entered a number and corrects them if not
                return selectedParameter;
            }
            else{                                                                                  
                alert("Entry Not recognized. Please enter " + parameter + " as a integer number");
                selectedParameter = getIntegerSearchParameter(parameter);
                return selectedParameter;
            }
    }
    else if (userChoice === "no"){
        return "not applicable";
    }
    else{
        alert("Input not recognized. Please select yes or no ");
       selectedParameter =  getIntegerSearchParameter(parameter);
       return selectedParameter;
    }
}
function getAge(people){ // this creates a seperate array of people with their ages added
    var peopleWithAge;
    var birthday;
    peopleWithAge = people.map(function(element){
        birthday = obtainBirthday(element.dob);
        element.age = subtractDates(birthday);
        return element;
    });
    return peopleWithAge;
}
function obtainBirthday(date){ //this function moves the date entered in data base to yyyy/mm/dd format
    var placeholder;
    placeholder = date.split("/");
    var year;
    var month;
    var day;
    year = placeholder[2];
    day = placeholder[1];
    month = placeholder[0] - 1;
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
function getDescendants(person, people){ //this function gathers descendent information
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
        var descendantsDescendants;
        for (var i = 0; i < descendants.length; i++) {
            descendantsDescendants = searchByParentId(descendants[i].id, people); //if there are descendants it calls the function for each descendant
        }
    }
    if (descendantsDescendants){
    descendants = descendants.concat(descendantsDescendants);
    }
    return descendants;
}
function reportDescendants(descendants, person){ //this function reports if descendants are found in alert boxes
    var descendantsNames
    descendantsNames = getNamesWithLinebreaks(descendants);
    if (!descendants[0]) { //checks if there are descendants
        alert(person.firstName + ' ' + person.lastName + " has no descendants on file.");
    }
    else{
        alert(person.firstName + ' ' + person.lastName + " has descendants:\n" + descendantsNames);
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
function getNamesWithLinebreaks(selectedGroup){ //this function gathers names for alert boxes
    var groupNames;
    groupNames = selectedGroup.map(function(element){
        return element.firstName + " " + element.lastName
    });
    groupNames = groupNames.join(";\n");
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
function getPersonInfo(person, people){ //this function displays found persons info
    var personInfo;
    personInfo = sortInfo(person);
    alert("Found person information:\n" + personInfo);
    mainMenu(person, people);
}
function sortInfo(person){ //this function organizes info for getPersonInfo
    var trait;
    var personInfo = [];
    var traitValue;
    for(trait in person){
        traitValue = person[trait];
        personInfo.push(trait + ": " + traitValue);
    }
    personInfo = personInfo.join(";\n");
    return personInfo;
}

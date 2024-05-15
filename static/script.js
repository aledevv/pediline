
/**
 * This variable stores the logged in user
 */
var loggedUser = {};

/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 */



function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    // console.log(email);

    fetch('/api/v1/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.id = data.id;
        loggedUser.line = data.line;
        loggedUser.stop = data.stop;
        loggedUser.self = data.self;
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").textContent = loggedUser.email;
        getUserLine(loggedUser.line);
        getUserStop(loggedUser.stop);
        console.log(loggedUser);
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

function getUserLine(lineId){
    fetch('/api/v1/lines/' + lineId)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        document.getElementById("userLine").textContent = data.name;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

}

function getUserStop(stopId){
    fetch('/api/v1/stops/' + stopId)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        document.getElementById("userStop").textContent = data.name;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

}

function showLines() {

    const ul = document.getElementById('lines'); // Get the list where we will place our authors

    ul.textContent = '';

    fetch('/api/v1/lines')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        console.log(data);
        
        return data.map(function(line) { // Map through the results and for each run the code below
            
            // let lineId = line.self.substring(line.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${line.self}">${line.name}</a>`;
            let a = document.createElement('a');
            a.href = line.self
            a.textContent = line.name;
            // span.innerHTML += `<button type="button" onclick="takeLine('${line.self}')">Select line</button>`
            let button = document.createElement('button');
            button.type = 'button'
            button.onclick = ()=>selectLine(getIdfromURL(line.self));
            button.textContent = 'Select line';

            let stopButton = document.createElement('button');
            stopButton.type = 'button'
            stopButton.onclick = ()=>showStops(getIdfromURL(line.self),line.stops);
            stopButton.textContent = 'Show stops';


            let stopUl = document.createElement('ul');
            stopUl.id = getIdfromURL(line.self);
            
            // Append all our elements
            span.appendChild(a);
            span.appendChild(button);
            span.appendChild(stopButton);
            li.appendChild(span);
            ul.appendChild(li);
            li.appendChild(stopUl);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

function selectLine(lineId)
{
    fetch('/api/v1/users/' + loggedUser.id , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( {  line: lineId } ),
    })
    .then((resp) => {
        //console.log(resp);
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
    getUserLine(lineId);
};






function showStops(lineId, stops) {

    const ul = document.getElementById(lineId); 

    ul.textContent = '';


    fetch('/api/v1/stops?lineId=' + lineId)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        console.log(data);
        
        return data.map(function(stop) { // Map through the results and for each run the code below
            
            // let lineId = line.self.substring(line.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${line.self}">${line.name}</a>`;
            let a = document.createElement('a');
            a.href = stop.self
            a.textContent = stop.name + " - " + stop.schedule;
            // span.innerHTML += `<button type="button" onclick="takeLine('${line.self}')">Select line</button>`
            let button = document.createElement('button');
            button.type = 'button'
            //button.onclick = ()=>selectLine(getIdfromURL(stop.self));
            button.textContent = 'Select stop';

        
            // Append all our elements
            span.appendChild(a);
            span.appendChild(button);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}










function getIdfromURL(url)
{
    return url.substring(url.lastIndexOf('/') + 1);
}


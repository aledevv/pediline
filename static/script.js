
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

/**
 * This function refresh the list of books
 */
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
            button.onclick = ()=>takeLine(line.self)
            button.textContent = 'Select line';
            
            // Append all our elements
            span.appendChild(a);
            span.appendChild(button);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
// loadBooks();

/**
 * This function is called by the Take button beside each book.
 * It create a new booklendings resource,
 * given the book and the logged in student
 */
// function takeBook(bookUrl)
// {
//     fetch('../api/v1/booklendings', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'x-access-token': loggedUser.token
//         },
//         body: JSON.stringify( { student: loggedUser.self, book: bookUrl } ),
//     })
//     .then((resp) => {
//         console.log(resp);
//         loadLendings();
//         return;
//     })
//     .catch( error => console.error(error) ); // If there is any error you will catch them here

// };

/**
 * This function refresh the list of bookLendings.
 * It only load bookLendings given the logged in student.
 * It is called every time a book is taken of when the user login.
//  */
// function loadLendings() {

//     const ul = document.getElementById('bookLendings'); // Get the list where we will place our lendings

//     ul.innerHTML = '';

//     fetch('../api/v1/booklendings?studentId=' + loggedUser.id + '&token=' + loggedUser.token)
//     .then((resp) => resp.json()) // Transform the data into json
//     .then(function(data) { // Here you get the data to modify as you please
        
//         console.log(data);
        
//         return data.map( (entry) => { // Map through the results and for each run the code below
            
//             // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
//             let li = document.createElement('li');
//             let span = document.createElement('span');
//             // span.innerHTML = `<a href="${entry.self}">${entry.book}</a>`;
//             let a = document.createElement('a');
//             a.href = entry.self
//             a.textContent = entry.book;
            
//             // Append all our elements
//             span.appendChild(a);
//             li.appendChild(span);
//             ul.appendChild(li);
//         })
//     })
//     .catch( error => console.error(error) );// If there is any error you will catch them here
    
// }


/**
 * This function is called by clicking on the "insert book" button.
 * It creates a new book given the specified title,
 * and force the refresh of the whole list of books.
 */
// function showLines()
// {

//     fetch('/api/v1/lines', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//     })
//     .then((resp) => {
//         console.log(resp);
//         return;
//     })
//     .catch( error => console.error(error) ); // If there is any error you will catch them here

// };
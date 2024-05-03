const express = require('express');    
const mongoose = require('mongoose');

const app = express();

//midelleware
app.use(express.json());    // Middleware to parse JSON data (otheriwse you get undefined)



mongoose        // Connect to MongoDB
    .connect(
        'mongodb+srv://admin:piediUNITN@pedilinedb.inhrctf.mongodb.net/Pediline?retryWrites=true&w=majority&appName=pedilineDB'
    )
    .then(() => {
        console.log('Connesso a MongoDB');        // Connection to MongoDB successful
        app.listen(3000, () => {                    // Start the server
            console.log('Il server è in esecuzione sulla porta 3000');
        });
    })
    .catch(() => {
        console.log('Connessione a MongoDB fallita');
    });
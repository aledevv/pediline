const app = require('./app/app.js');
const mongoose = require('mongoose');
const mongoDBToken = require('./config.js');

const port = 3000;

app.locals.db = mongoose.connect(mongoDBToken)
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});
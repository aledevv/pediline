const express = require('express');
const app = express();

// const users = require('./users.js');
const lines = require('./lines.js');
const stops = require('./stops.js');
const lists = require('./lists.js');
const calendars = require('./calendars.js');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
// // Add headers before the routes are defined
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// If process.env.FRONTEND folder does not contain index.html then use the one from static
*/
//app.use('/', express.static('static')); // expose also this folder


app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use('/api/v1/stops', stops);
// app.use('/api/v1/users', users);
app.use('/api/v1/lines', lines);
app.use('/api/v1/lists', lists);
app.use('/api/v1/calendars', calendars);

app.get('/', (req, res) => {
    res.send('Hello from PediLine!');
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});




;
module.exports = app;








// // previous implementation --------------------------------------------------------- //

// const express = require('express');    
// const mongoose = require('mongoose');
// const Stop = require('../pediline/models/stop.model.js');
// const School = require('../pediline/models/school.model.js');
// const Line = require('../pediline/models/line.model.js');
// const mongoDBToken = require('../config.js'); // Path al file config.js

// const app = express();

// //midelleware
// app.use(express.json());    // Middleware to parse JSON data (otheriwse you get undefined)


// app.get('/api/v1/', async(req,res)=>{
//     try{
//         //inserire
//     }catch (err){
//         //inserire
//     }
// });


// /*******************FERMATE************************/ 

// app.get('/api/v1/stops/', async (req, res) => {
//     try {
//         const stops = await Stop.find();
//         res.status(200).json(stops);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.get('/api/v1/stops/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const stop = await Stop.findById(id);
//         res.status(200).json(stop);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.post('/api/v1/stops/', async (req, res) => {
//     try {
//         const stops = await Stop.create(req.body);
//         res.status(200).json(stops);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });



// app.delete('/api/v1/stops/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedStop = await Stop.findByIdAndDelete(id);

//         if (!deletedStop) {
//             return res.status(404).json({ message: 'Stop not found' });
//         }

//         res.status(200).json(deletedStop);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     });


// app.put('/api/v1/stops/:id', async (req, res) => { //modifica oggetto specifico
//     try {
//         const { id } = req.params;
//         const stop = await Stop.findByIdAndUpdate(id, req.body);

//         if (!stop) {
//             return res.status(404).json({ message: 'Stop not found' });
//         }

//         const updated = await Stop.findById(id);

//         res.status(200).json(updated);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     });


// /*****************************************************************************/

// /*******************SCUOLE************************/ 

// app.get('/api/v1/schools/', async (req, res) => {
//     try {
//         const schools = await School.find();
//         res.status(200).json(schools);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.get('/api/v1/schools/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const school = await School.findById(id);
//         res.status(200).json(school);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.post('/api/v1/schools/', async (req, res) => {
//     try {
//         const schools = await School.create(req.body);
//         res.status(200).json(schools);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.delete('/api/v1/schools/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedSchool = await School.findByIdAndDelete(id);

//         if (!deletedSchool) {
//             return res.status(404).json({ message: 'School not found' });
//         }

//         res.status(200).json(deletedSchool);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     });


// app.put('/api/v1/schools/:id', async (req, res) => { //modifica oggetto specifico
//     try {
//         const { id } = req.params;
//         const school = await School.findByIdAndUpdate(id, req.body);

//         if (!school) {
//             return res.status(404).json({ message: 'School not found' });
//         }

//         const updated = await School.findById(id);

//         res.status(200).json(updated);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     });

// /*****************************************************************************/

// /*******************LINEE************************/ 

// app.get('/api/v1/lines/', async (req, res) => {
//     try {
//         const lines = await Line.find();
//         res.status(200).json(lines);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.get('/api/v1/lines/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const line = await Line.findById(id);
//         res.status(200).json(line);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.post('/api/v1/lines/', async (req, res) => {
//     try {
//         const lines = await Line.create(req.body);
//         res.status(200).json(lines);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// app.delete('/api/v1/lines/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedLine = await Line.findByIdAndDelete(id);

//         if (!deletedLine) {
//             return res.status(404).json({ message: 'Line not found' });
//         }

//         res.status(200).json(deletedLine);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     });


// app.put('/api/v1/lines/:id', async (req, res) => { //modifica oggetto specifico
//     try {
//         const { id } = req.params;
//         const line = await Line.findByIdAndUpdate(id, req.body);

//         if (!line) {
//             return res.status(404).json({ message: 'Line not found' });
//         }

//         const updated = await Line.findById(id);

//         res.status(200).json(updated);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     });

// /*****************************************************************************/


// app.get('/', (req, res) => {
//     res.send('Hello from PediLine!');
// });

// mongoose        // Connect to MongoDB
//     .connect(mongoDBToken)
//     .then(() => {
//         console.log('Connesso a MongoDB');        // Connection to MongoDB successful
//         app.listen(3000, () => {                    // Start the server
//             console.log('Il server è in esecuzione sulla porta 3000');
//         });
//     })
//     .catch(() => {
//         console.log('Connessione a MongoDB fallita');
//     });


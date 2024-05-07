const express = require('express');    
const mongoose = require('mongoose');
const Stop = require('../pediline/models/stop.model.js');
const mongoDBToken = require('./config'); // Path al file config.js

const app = express();

//midelleware
app.use(express.json());    // Middleware to parse JSON data (otheriwse you get undefined)


app.get('/api/v1/', async(req,res)=>{
    try{
        //inserire
    }catch (err){
        //inserire
    }
});


/*******************FERMATE************************/ 

app.get('/api/v1/stops/', async (req, res) => {
    try {
        const stops = await Stop.find();
        res.status(200).json(stops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/v1/stops/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const stop = await Stop.findById(id);
        res.status(200).json(stop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/api/v1/stops/', async (req, res) => {
    try {
        const stops = await Stop.create(req.body);
        res.status(200).json(stops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.delete('/api/v1/stops/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStop = await Stop.findByIdAndDelete(id);

        if (!deletedStop) {
            return res.status(404).json({ message: 'Stop not found' });
        }

        res.status(200).json(deletedStop);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });


app.put('/api/v1/stops/:id', async (req, res) => { //modifica oggetto specifico
    try {
        const { id } = req.params;
        const stop = await Stop.findByIdAndUpdate(id, req.body);

        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }

        const updated = await Stop.findById(id);

        res.status(200).json(updated);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });


/*****************************************************************************/



const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


app.get('/', (req, res) => {
    res.send('Hello from PediLine!');
});

mongoose        // Connect to MongoDB
    .connect(mongoDBToken)
    .then(() => {
        console.log('Connesso a MongoDB');        // Connection to MongoDB successful
        app.listen(3000, () => {                    // Start the server
            console.log('Il server è in esecuzione sulla porta 3000');
        });
    })
    .catch(() => {
        console.log('Connessione a MongoDB fallita');
    });
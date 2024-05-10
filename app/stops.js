const express = require('express');
const router = express.Router();
const Stop = require('./models/stop');

router.get('', async (req, res) => {
    let stops = await Stop.find({});
    stops = stops.map( (stop) => {
        return {
            self: '/api/v1/stops/' + stop.id,
            name: stop.name,
            schedule: stop.schedule,
            position: stop.position
        };
    });
    res.status(200).json(stops);
});

router.get('/:id', async (req, res) => {
    let stop = await Stop.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/stops/' + stop.id,
        name: stop.name,
        schedule: stop.schedule,
        position: stop.position
    });
});

// delete gestibile solamente dall'admin? da implementare
router.delete('/:id', async (req, res) => {
    let stop = await Stop.findById(req.params.id).exec();
    if (!stop) {
        res.status(404).send()
        console.log('stop not found')
        return;
    }
    await stop.deleteOne()
    console.log('stop removed')
    res.status(204).send()
});


// post gestibile solamente dall'admin? da implementare
router.post('', async (req, res) => {

	let stop = new Stop({
        name: req.body.name,
        schedule: req.body.schedule,
        position: req.body.position
    });
    
	stop = await stop.save();
    let stopId = stop.id;
    console.log('Stop saved successfully');

    res.location("/api/v1/stops/" + stopId).status(201).json(stop).send();
});


module.exports = router;

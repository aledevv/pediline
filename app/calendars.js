const express = require('express');
const router = express.Router();
const Calendar = require('./models/calendar');

router.get('', async (req, res) => {
    let calendars = await Calendar.find({});
    calendars = calendars.map( (calendar) => {
        return {
            self: '/api/v1/calendars/' + calendar.id,
            listePresenze: calendar.listePresenze,
	        bacheca: calendar.bacheca
        };
    });
    res.status(200).json(calendars);
});

router.get('/:id', async (req, res) => {
    let calendar = await Calendar.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/calendars/' + calendar.id,
        listePresenze: calendar.listePresenze,
        bacheca: calendar.bacheca
    });
});

// delete gestibile solamente dall'admin? da implementare
router.delete('/:id', async (req, res) => {
    let calendar = await Calendar.findById(req.params.id).exec();
    if (!calendar) {
        res.status(404).send()
        console.log('calendar not found')
        return;
    }
    await calendar.deleteOne()
    console.log('calendar removed')
    res.status(204).send()
});


// post gestibile solamente dall'admin? da implementare
router.post('', async (req, res) => {

	let calendar = new Calendar({
        listePresenze: req.body.listePresenze,
	    bacheca: req.body.bacheca
    });
    
	calendar = await calendar.save();
    let stopId = calendar.id;
    console.log('Calendar saved successfully');

    res.location("/api/v1/calendars/" + stopId).status(201).json(calendar).send();
});


module.exports = router;

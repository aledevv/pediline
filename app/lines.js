const express = require('express');
const router = express.Router();
const Line = require('./models/line'); 
// const Line = require('./models/line');


router.get('', async (req, res) => {
    let lines = await Line.find({});
    lines = lines.map( (line) => {
        return {
            self: '/api/v1/lines/' + line.id,
            name: line.name,
            color: line.color,
            stops: line.stops
        };
    });
    res.status(200).json(lines);
});

router.get('/:id', async (req, res) => {
    let line = await Line.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/lines/' + line.id,
        name: line.name,
        color: line.color,
        stops: line.stops
    });
});

// delete gestibile solamente dall'admin? da implementare
router.delete('/:id', async (req, res) => {
    let line = await Line.findById(req.params.id).exec();
    if (!line) {
        res.status(404).send()
        console.log('line not found')
        return;
    }
    await line.deleteOne()
    console.log('line removed')
    res.status(204).send()
});


// post gestibile solamente dall'admin? da implementare
router.post('', async (req, res) => {

	let line = new Line({
        name: req.body.name,
        color: req.body.color,
        stops: req.body.stops
    });
    
	line = await line.save();
    let lineId = line.id;
    console.log('Line saved successfully');

    res.location("/api/v1/lines/" + lineId).status(201).json(line).send();
});


module.exports = router;

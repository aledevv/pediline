const express = require('express');
const router = express.Router();
const Line = require('./models/line'); 

router.get('/', async (req, res) => {
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

router.put('/:id', async (req, res) => { //modifica oggetto specifico
    //try {
        const { id } = req.params;
        const line = await Line.findByIdAndUpdate(id, req.body);

        if(!line) {
            return res.status(404).json({ message: 'Line not found' });
        }

        const updated = await Line.findById(id);

        res.status(200).json(updated);

    /*} catch (err) {
        res.status(500).json({ message: err.message });
    }*/
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

module.exports = router;

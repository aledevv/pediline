const express = require('express');
const router = express.Router();
const Line = require('./models/line'); 
// const Stop = require('./models/stop');


// da rivedere
router.get('', async (req, res) => {
    let lines;

    if ( req.query.studentId )
        lines = await Line.find({
            studentId: req.query.studentId
        }).exec();
    
    else
        lines = await Line.find({}).exec();

    lines = lines.map( (dbEntry) => {
        return {
            self: '/api/v1/lines/' + dbEntry.id,
            student: '/api/v1/users/' + dbEntry.userId,
            book: '/api/v1/stops/' + dbEntry.stopId
        };
    });

    res.status(200).json(lines);
});


// da implementare
router.post('', async (req, res) => {
    let line = new Line(req.body);
    line = await line.save();
    res.status(201).json(line);
});


// da implementare
router.delete('/:id', async (req, res) => {
    let line = await Line.findById(req.params.id).exec();
    if (!line) {
        res.status(404).send()
        console.log('line not found')
        return;
    }
    await stop.deleteOne()
    console.log('line removed')
    res.status(204).send()
});



module.exports = router;
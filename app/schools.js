const express = require('express');
const router = express.Router();
const School = require('./models/school'); 



router.get('/', async (req, res) => {
    let schools = await School.find({});
    schools = schools.map( (school) => {
        return {
            self: '/api/v1/schools/' + school._id,
            name: school.name,
            linesId: school.linesId,
            position: school.position
        };
    });
    res.status(200).json(schools);
});


router.get('/:id', async (req, res) => {
    let school;
    try{
        school = await School.findById(req.params.id);
        if (!school) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/schools/' + school.id,
            name: school.name,
            linesId: school.linesId,
            position: school.position
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
    
});


router.post('', async (req, res) => {

	let school = new School({
        name: req.body.name,
        linesId: req.body.linesId,
        position: req.body.position
    });
    
	school = await school.save();
    let schoolId = school.id;
    console.log('School saved successfully');

    res.location("/api/v1/schools/" + schoolId).status(201).json(school).send();
});


router.put('/:id', async (req, res) => {
    let school;
    try {
        const { id } = req.params;
        school = await School.findByIdAndUpdate(id, req.body);

        if(!school) {
            return res.status(404).send("School not found");
        }
        const update = await School.findById(id);
        res.status(200).json(update);

    } catch (err) {
        res.status(500).send("500 Internal Server Error");
    }
});


router.delete('/:id', async (req, res) => {
    let school = await School.findById(req.params.id).exec();
    if (!school) {
        res.status(404).send('school not found');
        console.log('school not found');
        return;
    }
    await school.deleteOne();
    console.log('school removed');
    res.status(204).send();
});

module.exports = router;



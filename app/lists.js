const express = require('express');
const router = express.Router();
const List = require('./models/list'); 


router.get('', async (req, res) => {
    let lists = await List.find({});
    lists = lists.map( (list) => {
        return {
            self: '/api/v1/lists/' + list.id,
            day: list.day,
            leaders: list.leaders,
            studentsPresent: list.studentsPresent,
            studentsAbsent: list.studentsAbsent
        };
    });
    res.status(200).json(lists);
});

router.get('/:id', async (req, res) => {
    let list = await List.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/lists/' + list.id,
        day: list.day,
        leaders: list.leaders,
        studentsPresent: list.studentsPresent,
        studentsAbsent: list.studentsAbsent
    });
});

// delete gestibile solamente dall'admin? da implementare
router.delete('/:id', async (req, res) => {
    let list = await List.findById(req.params.id).exec();
    if (!list) {
        res.status(404).send()
        console.log('list not found')
        return;
    }
    await list.deleteOne()
    console.log('list removed')
    res.status(204).send()
});


// post gestibile solamente dall'admin? da implementare
router.post('', async (req, res) => {

	let list = new List({
        day: req.body.day,
        leaders: req.body.leaders,
        studentsPresent: req.body.studentsPresent,
        studentsAbsent: req.body.studentsAbsent
    });
    
	list = await list.save();
    let listId = list.id;
    console.log('list saved successfully');

    res.location("/api/v1/lists/" + listId).status(201).json(list).send();
});


module.exports = router;
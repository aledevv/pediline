const express = require('express');
const router = express.Router();
const List = require('./models/list'); 

/**
 * @openapi
 * /api/v1/lists:
 *  get:
 *    summary: Get all lists
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Success and returns all lists
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/List'
 *        examples:
 *         Lists:
 *          value:
 *           - self: "/api/v1/lists/1"
 *             day: "2024-05-12"
 *             leaders: ["leader1", "leader2"]
 *             studentsPresent: ["student1", "student2"]
 *             studentsAbsent: ["student3", "student4"]
 *           - self: "/api/v1/lists/2"
 *             day: "2024-05-13"
 *             leaders: ["leader3", "leader4"]
 *             studentsPresent: ["student5", "student6"]
 *             studentsAbsent: ["student7", "student8"]
 *    tags:
 *     - Lists
 */
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

/**
 * @openapi
 * /api/v1/lists/{id}:
 *  get:
 *    summary: Get a list by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the list to get
 *       schema:
 *        type: string
 *    responses:
 *     200:
 *      description: Success and returns the list
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/List'
 *        examples:
 *         ListExample:
 *          value:
 *           self: "/api/v1/lists/1"
 *           day: "2024-05-12"
 *           leaders: ["leader1", "leader2"]
 *           studentsPresent: ["student1", "student2"]
 *           studentsAbsent: ["student3", "student4"]
 *    tags:
 *     - Lists
 */
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

/**
 * @openapi
 * /api/v1/lists/:
 *  post:
 *    summary: Creates a new list
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: body
 *       name: body
 *       type: object
 *       required: true
 *       description: List object
 *       schema:
 *        $ref: '#/components/schemas/List'
 *    responses:
 *     201:
 *      description: Success and returns the created list
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/List'
 *        example:
 *          day: "2024-05-12"
 *          leaders: ["leader1", "leader2"]
 *          studentsPresent: ["student1", "student2"]
 *          studentsAbsent: ["student3", "student4"]
 *    tags:
 *     - Lists
 */
router.post('', async (req, res) => {

	let list = new List({
        day: req.body.day,
        leaders: req.body.leaders,
        studentsPresent: req.body.studentsPresent,
        studentsAbsent: req.body.studentsAbsent
    });
    
	list = await list.save();
    let listId = list.id;
    console.log('List saved successfully');

    res.location("/api/v1/lists/" + listId).status(201).json(list).send();
});

/**
 * @openapi
 * /api/v1/lists/{id}:
 *  delete:
 *    summary: Deletes a list by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the list to delete
 *      schema:
 *       type: string
 *    responses:
 *     204:
 *      description: Success, list deleted
 *     404:
 *      description: List not found
 *    tags:
 *     - Lists
 */
router.delete('/:id', async (req, res) => {
    let list = await List.findById(req.params.id).exec();
    if (!list) {
        res.status(404).send()
        console.log('List not found')
        return;
    }
    await list.deleteOne()
    console.log('List removed')
    res.status(204).send()
});

module.exports = router;

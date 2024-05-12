const express = require('express');
const router = express.Router();
const Line = require('./models/line'); 
// const Line = require('./models/line');


/**
 * @openapi
 * /api/v1/lines:
 *  get:
 *    summary: Get all lines
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Success and returns all lines
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Line'
 *        examples:
 *         Lines:
 *          value:
 *            1:
 *             self: "/api/v1/lines/1"
 *             name: "Line 1"
 *             color: "red"
 *             stops: ["stop1", "stop2"]
 *            2:
 *             self: "/api/v1/lines/2"
 *             name: "Line 2"
 *             color: "blue"
 *             stops: ["stop3", "stop4"]
 *    tags:
 *     - Lines
 */
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


/**
 * @openapi
 * /api/v1/lines/{id}:
 *  get:
 *    summary: Get a line by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the line to get
 *       schema:
 *        type: string
 *    responses:
 *     200:
 *      description: Success and returns the line
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Line'
 *        examples:
 *         FermataEsempio:
 *          value:
 *           name: "Line 1"
 *           color: "red"
 *           stops: ["stop1", "stop2"]
 *    tags:
 *     - Lines
 */
router.get('/:id', async (req, res) => {
    let line = await Line.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/lines/' + line.id,
        name: line.name,
        color: line.color,
        stops: line.stops
    });
});



/**
 * @openapi
 * /api/v1/lines/:
 *  post:
 *    summary: Creates a new line
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: body
 *       name: body
 *       type: object
 *       required: true
 *       description: Line object
 *       schema:
 *        $ref: '#/components/schemas/Line'
 *    responses:
 *     201:
 *      description: Success and returns the created line
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Line'
 *        example:
 *          name: "Line 1"
 *          color: "green"
 *          stops: ["stop1_ID", "stop2_ID"]
 *    tags:
 *     - Lines
 */
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


/**
 * @openapi
 * /api/v1/lines/{id}:
 *  put:
 *    summary: Updates a line by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: body
 *       name: body
 *       type: object
 *       required: true
 *       description: Line object with updated values
 *       schema:
 *        $ref: '#/components/schemas/Line'
 *    responses:
 *     200:
 *      description: Success and returns the updated line
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Line'
 *        example:
 *          name: "Line 1"
 *          color: "green"
 *          stops: ["stop1_ID", "stop2_ID"]
 *     404:
 *      description: Line not found
 *    tags:
 *     - Lines
 */
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


/**
 * @openapi
 * /api/v1/lines/{id}:
 *  delete:
 *    summary: Deletes a line by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the line to delete
 *      schema:
 *       type: string
 *    responses:
 *     204:
 *      description: Success, line deleted
 *     404:
 *      description: Line not found
 *    tags:
 *     - Lines
 */

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

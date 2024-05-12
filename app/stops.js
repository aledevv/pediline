const express = require('express');
const router = express.Router();
const Stop = require('./models/stop');

/**
 * @openapi
 * /api/v1/stops:
 *  get:
 *    summary: Get all stops
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Success and returns all stops
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Stop'
 *        examples:
 *         Stops:
 *          value:
 *           - self: "/api/v1/stops/1"
 *             name: "Stop 1"
 *             schedule: "08:00 - 08:30"
 *             position: [40.7128, -74.0060]
 *           - self: "/api/v1/stops/2"
 *             name: "Stop 2"
 *             schedule: "09:00 - 09:30"
 *             position: [51.5074, -0.1278]
 *    tags:
 *     - Stops
 */
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

/**
 * @openapi
 * /api/v1/stops/{id}:
 *  get:
 *    summary: Get a stop by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the stop to get
 *       schema:
 *        type: string
 *    responses:
 *     200:
 *      description: Success and returns the stop
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Stop'
 *        examples:
 *         StopExample:
 *          value:
 *           self: "/api/v1/stops/1"
 *           name: "Stop 1"
 *           schedule: "08:00 - 08:30"
 *           position: [40.7128, -74.0060]
 *    tags:
 *     - Stops
 */
router.get('/:id', async (req, res) => {
    let stop = await Stop.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/stops/' + stop.id,
        name: stop.name,
        schedule: stop.schedule,
        position: stop.position
    });
});

/**
 * @openapi
 * /api/v1/stops/:
 *  post:
 *    summary: Creates a new stop
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: body
 *       name: body
 *       type: object
 *       required: true
 *       description: Stop object
 *       schema:
 *        $ref: '#/components/schemas/Stop'
 *    responses:
 *     201:
 *      description: Success and returns the created stop
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Stop'
 *        example:
 *          name: "Stop 1"
 *          schedule: "08:00 - 08:30"
 *          position: [40.7128, -74.0060]
 *    tags:
 *     - Stops
 */
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

/**
 * @openapi
 * /api/v1/stops/{id}:
 *  delete:
 *    summary: Deletes a stop by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the stop to delete
 *      schema:
 *       type: string
 *    responses:
 *     204:
 *      description: Success, stop deleted
 *     404:
 *      description: Stop not found
 *    tags:
 *     - Stops
 */
router.delete('/:id', async (req, res) => {
    let stop = await Stop.findById(req.params.id).exec();
    if (!stop) {
        res.status(404).send()
        console.log('Stop not found')
        return;
    }
    await stop.deleteOne()
    console.log('Stop removed')
    res.status(204).send()
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Calendar = require('./models/calendar');

/**
 * @openapi
 * /api/v1/calendars:
 *  get:
 *    summary: Get all calendars
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Success and returns all calendars
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/Calendar'
 *        examples:
 *         Calendars:
 *          value:
 *           - self: "/api/v1/calendars/1"
 *             listePresenze: ["event1", "event2"]
 *             bacheca: ["post1", "post2"]
 *           - self: "/api/v1/calendars/2"
 *             listePresenze: ["event3", "event4"]
 *             bacheca: ["post3", "post4"]
 *    tags:
 *     - Calendars
 */
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

/**
 * @openapi
 * /api/v1/calendars/{id}:
 *  get:
 *    summary: Get a calendar by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID of the calendar to get
 *       schema:
 *        type: string
 *    responses:
 *     200:
 *      description: Success and returns the calendar
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Calendar'
 *        examples:
 *         CalendarExample:
 *          value:
 *           self: "/api/v1/calendars/1"
 *           listePresenze: ["event1", "event2"]
 *           bacheca: ["post1", "post2"]
 *    tags:
 *     - Calendars
 */
router.get('/:id', async (req, res) => {
    let calendar = await Calendar.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/calendars/' + calendar.id,
        listePresenze: calendar.listePresenze,
        bacheca: calendar.bacheca
    });
});

/**
 * @openapi
 * /api/v1/calendars/:
 *  post:
 *    summary: Creates a new calendar
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: body
 *       name: body
 *       type: object
 *       required: true
 *       description: Calendar object
 *       schema:
 *        $ref: '#/components/schemas/Calendar'
 *    responses:
 *     201:
 *      description: Success and returns the created calendar
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Calendar'
 *        example:
 *          listePresenze: ["event1", "event2"]
 *          bacheca: ["post1", "post2"]
 *    tags:
 *     - Calendars
 */
router.post('', async (req, res) => {

	let calendar = new Calendar({
        listePresenze: req.body.listePresenze,
        bacheca: req.body.bacheca
    });
    
	calendar = await calendar.save();
    let calendarId = calendar.id;
    console.log('Calendar saved successfully');

    res.location("/api/v1/calendars/" + calendarId).status(201).json(calendar).send();
});

/**
 * @openapi
 * /api/v1/calendars/{id}:
 *  delete:
 *    summary: Deletes a calendar by ID
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the calendar to delete
 *      schema:
 *       type: string
 *    responses:
 *     204:
 *      description: Success, calendar deleted
 *     404:
 *      description: Calendar not found
 *    tags:
 *     - Calendars
 */
router.delete('/:id', async (req, res) => {
    let calendar = await Calendar.findById(req.params.id).exec();
    if (!calendar) {
        res.status(404).send()
        console.log('Calendar not found')
        return;
    }
    await calendar.deleteOne()
    console.log('Calendar removed')
    res.status(204).send()
});

module.exports = router;

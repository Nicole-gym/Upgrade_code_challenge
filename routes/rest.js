const express = require('express');
const router = express.Router();

// bussiness logic put in service
const reservationsService = require('../services/reservationsService')
const bodyParser = require('body-parser');
// josn parser to parse the body
const jsonParser = bodyParser.json();

// user request the information of the availability of campsite
router.get('/reservation', function(req, res) {
    const start = req.query.start;
    const end = req.query.end;
    reservationsService.getReservations(start, end)
      .then(reservations => res.json(reservations));
});

// user can reserve range of days on campsite
router.post('/reservation', jsonParser, function(req, res) {
	reservationsService.addReservation(req.body)
		.then(
      newreservation => {
			res.json(newreservation);
		},
    (error) => {
			res.status(400).send('only 3 days');
		});
});


// user can look up the specific reservation
router.get('/reservation/:id', function(req, res) {
	const id = req.params.id;
	reservationsService.getReservation(+id)
		.then(
      reservation => {
        res.json(reservation);
    },
    (error) => {
			res.status(400).send('reservation is not found');
		});
});

// user can modify the reservation
router.put('/reservation/:id', jsonParser, function(req, res) {
	const id = req.params.id;
	reservationsService.updateReservation(+id, req.body)
		.then(reservation => res.json(reservation));	//return in json
});


module.exports = router;

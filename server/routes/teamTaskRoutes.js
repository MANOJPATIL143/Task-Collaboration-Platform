const express = require('express');
const router = express.Router();
const { assignTask } = require('../controllers/TeamTaskController'); 

router.post('/', assignTask);

module.exports = router;

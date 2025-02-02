const express = require('express');
const { createTeam, getTeams, addMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createTeam);
router.get('/', protect, getTeams);
router.post('/add-member', protect, addMember);

module.exports = router;

const Team = require('../models/Team');
const User = require('../models/User');


exports.createTeam = async (req, res) => {
    try {
      const { name, memberIds } = req.body;
      const members = [req.user.id, ...new Set(memberIds)];
      const validMembers = await User.find({ _id: { $in: members } }).select('_id');
      const validMemberIds = validMembers.map(user => user._id.toString());
      // Create the team
      const team = new Team({ name, owner: req.user.id, members: validMemberIds });
      await team.save();
      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        team,
      });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };


exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.id }).populate('members', 'name email');
    res.status(200).json(teams);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.addMember = async (req, res) => {
  try {
    const { teamId, userId, email } = req.body;
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    if (team.members.includes(user._id)) {
      return res.status(400).json({ error: 'User is already a member' });
    }
    team.members.push(user._id);
    await team.save();
    res.status(200).json({ message: 'User added successfully', team });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
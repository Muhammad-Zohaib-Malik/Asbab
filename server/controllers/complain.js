const Complaint = require('../models/Complaints'); 

const createComplaint = async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ message: 'User and message are required' });
    }

    const complaint = new Complaint({
      user,
      message,
      // status will default to 'pending'
    });

    await complaint.save();

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint', error });
  }
};

const getComplaintsById = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.params.userId })
      // No ride ref now, so no populate needed
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error });
  }
};

module.exports = {
  createComplaint,
  getComplaintsById,
};

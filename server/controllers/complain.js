const Complaint = require("../models/Complaints");

const createComplaint = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Authenticated user:", req.user);

    const complaint = new Complaint({
      user: req.user._id,
      message,
    });

    const savedComplaint = await complaint.save();

    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getComplaintsById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const complaints = await Complaint.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createComplaint,
  getComplaintsById,
};

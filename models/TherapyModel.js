const mongoose = require("mongoose");

const TherapySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },    
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'draft'},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("therapy", TherapySchema);

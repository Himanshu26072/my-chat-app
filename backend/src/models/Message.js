const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false, 
    default: '',
  },
  fileUrl: {
    type: String,
  },
  fileName: {
    type: String,
  },
  fileType: {
    type: String,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
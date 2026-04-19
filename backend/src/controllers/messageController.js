const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    if (!req.body.text && !req.body.fileUrl) {
      return res.status(400).json({ message: 'Please add a text field or file' });
    }

    const message = await Message.create({
      text: req.body.text || '',
      fileUrl: req.body.fileUrl || null,
      fileName: req.body.fileName || null,
      fileType: req.body.fileType || null,
      user: req.user.id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id, { text: req.body.text, isEdited: true }, { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await message.deleteOne();
    res.status(200).json({ id: req.params.id }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearMessages = async (req, res) => {
  try {
    await Message.deleteMany({ user: req.user.id });
    res.status(200).json({ message: 'All messages cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, createMessage, updateMessage, deleteMessage, clearMessages };
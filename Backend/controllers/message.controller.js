import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (!newMessage) {
      gotConversation.messages.push(newMessage._id);
    }

    await gotConversation.save();

    return res.status(201).json({
      message: 'Message send successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages');
    console.log(conversation)
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

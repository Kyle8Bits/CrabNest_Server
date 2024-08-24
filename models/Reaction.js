const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['Like', 'Love', 'Haha', 'Angry'], required: true }, // Reaction type
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who reacted

    targetType: { type: String, enum: ['Post', 'Comment'], required: true }, // Reaction target type
    targetId: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetType', required: true }, // Target post or comment

    createdAt: { type: Date, default: Date.now } // Reaction creation timestamp
});

const Reaction = mongoose.model('Reaction', ReactionSchema);
module.exports = Reaction;

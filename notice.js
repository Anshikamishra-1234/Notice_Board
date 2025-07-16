import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['Announcement', 'Local Event', 'Buy/Sell/Rent'],
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);

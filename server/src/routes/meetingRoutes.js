/* routes/meetingRoutes.js */
import express from 'express';
import { Booking } from '../models/BookingModel.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const meetingRoom = express.Router();

// Get meeting details by booking ID
meetingRoom.get('/:bookingId', asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  
  const booking = await Booking.findById(bookingId)
    .populate('consultant', 'name email')
    .populate('user', 'name email');
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  if (booking.status !== 'scheduled') {
    return res.status(403).json({ 
      error: 'Meeting not available',
      status: booking.status 
    });
  }
  
  res.json({
    bookingId: booking._id,
    consultant: booking.consultant,
    user: booking.user,
    datetime: booking.datetime,
    duration: booking.duration,
    status: booking.status
  });
}));

// Update meeting status (start, end, etc.)
meetingRoom.patch('/:bookingId/status', asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { 
      status,
      ...(status === 'in-progress' && { startedAt: new Date() }),
      ...(status === 'completed' && { completedAt: new Date() })
    },
    { new: true }
  );
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  res.json({ status: booking.status });
}));

export { meetingRoom as meetingRoutes };

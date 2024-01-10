const { ValidationError , AppError } = require('../utils/errors/index');
const { Booking } = require('../models/index');
const { StatusCodes } = require('http-status-codes');

class BookingRepo {
    async create(data){
        try {
            const booking = Booking.create(data);
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'Issue creating a booking now ! Please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = BookingRepo;
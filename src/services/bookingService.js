const axios = require('axios');
const { BookingRepo } = require('../repositories/index');
const { ServiceError } = require('../utils/errors');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');

class BookingService {

    constructor () {
        this.bookingRepo = new BookingRepo();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/flight/${flightId}`;
            const response = await axios.get(getFlightRequestUrl);
            const flightData = response.data.data;
            const price = flightData.price;
            if(data.noOfSeats > flightData.noOfSeats){
                throw new ServiceError('Insufficient seats in the flight !');
            }
            const totalCost = price * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepo.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/flight/${booking.flightId}`;
            await axios.patch(updateFlightRequestUrl,{
                totalSeats : flightData.totalSeats - booking.noOfSeats
            });
            const finalBooking = await this.bookingRepo.update(booking.id,{status : "Booked"});
            return finalBooking;
        } catch (error) {
            if(error.name == 'ValidationError' || error.name == 'RepositoryError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;
"use client";
import EnlargedCardModal from "@components/EnlargedCardModal";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import PaymentsIcon from '@mui/icons-material/Payments';
import PlaceIcon from '@mui/icons-material/Place';
import { useState } from "react";
import styles from "@app/styles/get-rides.module.css";

const GetRidesCard = ({ ride, bookRide, exchangeRate }) => {
  const [
    source,
    destination,
    carDetails,
    driverDetails,
    pickPoint,
    distance,
    gasPrice,
    time,
  ] = ride.tDetails.toString().split(" + ");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const handleViewRide = (ride, event) => {
    setSelectedRide(ride);
    setIsModalOpen(true);
    setModalPosition({
      top: event.currentTarget.offsetTop + event.currentTarget.clientHeight + 10,
      left: event.currentTarget.offsetLeft
    });
  };

  const BookRideHandler = async () => {
    await bookRide(ride.rideId, ride.rideFare.toString());
  };

  const fareInUSD = Math.ceil(
    (parseFloat(ride.rideFare) / 1e18) * exchangeRate.USD
  );
  const dateTime = new Date(time);
  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <div className={styles.card} onMouseLeave={() => setIsModalOpen(false)}>
      <div className={styles.imageContainer}>
        {ride.mPassengers.toString() <= 4 ? (
          <img src="/images/car.png" alt="Small Car" className={styles.image} />
        ) : (
          <img src="/images/car2.png" alt="Big Car" className={styles.image} />
        )}
      </div>

      <div className={styles.tripdetails}>
        <ul>
          <li><PlaceIcon /> {source}</li>
          <li><HomeIcon /> {destination}</li>
          
        </ul>
      </div>
      <div className={styles.dateTime}>
            <div className={styles.date}>
              <CalendarTodayIcon /> {formattedDate}
            </div>
            <div className={styles.time}>
              <AccessTimeIcon /> {formattedTime}
            </div>
      </div>
       <div className={`${styles.costContainer}`}><PaymentsIcon></PaymentsIcon><span className={styles.cost}> Cost: {fareInUSD}$</span></div>
      <div className={styles.bookButtonContainer}>
        <button className={styles.bookButton} onClick={BookRideHandler}>
          BOOK
        </button>
        <button className={styles.bookButton} onClick={(e) => handleViewRide(ride, e)}>
          VIEW RIDE
        </button>
      </div>
      {isModalOpen && (
        <EnlargedCardModal
          ride={selectedRide}
          onClose={() => setIsModalOpen(false)}
          position={modalPosition}
        />
      )}
    </div>
  );
};

export default GetRidesCard;


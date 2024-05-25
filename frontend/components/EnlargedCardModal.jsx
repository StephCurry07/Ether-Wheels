// EnlargedCardModal.jsx

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import HailIcon from '@mui/icons-material/Hail';
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocaltaxiIcon from '@mui/icons-material/LocalTaxi';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import StraightIcon from '@mui/icons-material/Straight';
import styles from "@app/styles/enlarged-card-modal.module.css";

const EnlargedCardModal = ({ ride, onClose }) => {
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
      
      const dateTime = new Date(time);
      const formattedDate = dateTime.toLocaleDateString();
      const formattedTime = dateTime.toLocaleTimeString();
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2><center>Ride Details</center></h2>
        <div className={styles.ridedetails}>
        <ul>
          <li><PlaceIcon /> {source}</li>
          <li><CalendarTodayIcon /> {formattedDate}</li>
          <li><HomeIcon /> {destination}</li>
          <li><AccessTimeIcon /> {formattedTime}</li>
          <li><LocalGasStationIcon /> {gasPrice}</li>
          <li><DirectionsCarIcon /> {carDetails}</li>
          <li><LocaltaxiIcon /> {driverDetails}</li>
          <li><HailIcon /> {pickPoint}</li>
          <li><StraightIcon /> {distance}</li>
          <li><GroupIcon /> Max Passengers:{ride.mPassengers.toString()}</li>
          <li><PersonIcon /> Current Passengers:{ride.passengers.toString()}</li>
        </ul>
      </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EnlargedCardModal;

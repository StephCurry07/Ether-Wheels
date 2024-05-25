import "@app/styles/my-rides-card.css";

const MyRidesCard = ({ ride, cancelRide, completed, role, exchangeRate }) => {
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

  const fareInUSD = Math.ceil(
    (parseFloat(ride.rideFare) / 1e18) * exchangeRate.USD
  );
  console.log(ride.rideId, fareInUSD);
  const n = parseInt(ride.passengers);
  const totalFare =
  (role === "driver" ? (fareInUSD * n/(n+1)).toFixed(2) : (fareInUSD * 1/(n+1)).toFixed(2));
  const cancelRideHandler = async () => {
    await cancelRide(ride.rideId);
  };

  const completedHandler = async () => {
    await completed(ride.rideId, ride.time);
  };

  return (
    <div className="card">
      <h3>RIDE ID : {ride.rideId.toString()}</h3>
      <div className="card-item">
        <p>Date : {formattedDate}</p>
        <p>Time : {formattedTime}</p>
      </div>
      <div className="card-item">
        <p>Current Passengers : {ride.passengers.toString()}</p>
        <p>Max Passengers : {ride.mPassengers.toString()}</p>
      </div>
      <div className="card-item">
        <p>{distance}</p>
        <p>{gasPrice}</p>
      </div>
      <div className="card-item">
        <p>Ride Fare : {fareInUSD}$</p>
        <p>{pickPoint}</p>
      </div>
      <div className="card-item">
        <p>{source}</p>
        <p>{destination}</p>
      </div>
      <div className="card-item">
        <p>{driverDetails}</p>
        <p>{carDetails}</p>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          borderTop: "2px dotted #000",
        }}
      >
        <div
          className="card-item"
          style={{ marginLeft: "50px", marginTop: "10px" }}
        >
          <p>Total Fare : {totalFare}$</p>
        </div>
        <button
          className="btn"
          style={{ color: "red" }}
          onClick={cancelRideHandler}
        >
          Cancel Ride
        </button>
        <button
          className="btn"
          style={{ color: "green" }}
          onClick={completedHandler}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default MyRidesCard;

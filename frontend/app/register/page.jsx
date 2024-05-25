"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const connectedAccount = searchParams.get("connectedAccount");
  const balance = searchParams.get("balance");

  return (
    <div className="registerContainer">
      <div className="register-card">
        <Image
          src="/images/driver.jpg"
          alt="Driver image"
          width={180}
          height={150}
        />
        <p
          style={{
            textAlign: "justify",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          Register yourself as a driver and provide details for your ride like
          source and destination ,max passengers, car details etc. The ride fare
          will be calculated automatically using source and destination
          distance. Money will be credited into your account once the ride is
          successfully marked completed by each passenger.
        </p>
        <Link
          href={{
            pathname: "/register/driver",
            query: {
              connectedAccount: connectedAccount,
              balance: balance,
              role: "driver",
            },
          }}
          style={{ marginTop: "auto" }}
        >
          <button className="btn-connect" style={{ boxShadow: "none" }}>
            Register as Driver
          </button>
        </Link>
      </div>
      <div className="register-card">
        <Image
          src="/images/passenger.jpg"
          alt="Passenger image"
          width={150}
          height={150}
        />
        <p
          style={{
            textAlign: "justify",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          Registering as a passenger will give you access to a list of all the
          available rides to choose from along with filters to find the right
          ride for you. Booking a ride will immediately deduct the dynamically
          set ride fare amount from your account. Once completed, the ride's
          status can be updated to completed.
        </p>
        <Link
          href={{
            pathname: "/register/passenger",
            query: {
              connectedAccount: connectedAccount,
              balance: balance,
              role: "passenger",
            },
          }}
          style={{ marginTop: "auto" }}
        >
          <button className="btn-connect" style={{ boxShadow: "none" }}>
            Register as Passenger
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;

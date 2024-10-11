"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "../../styles/user-registration.module.css";

const PassengerRegistration = () => {
  const searchParams = useSearchParams();
  const connectedAccount = searchParams.get("connectedAccount");
  const balance = searchParams.get("balance");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  const sendEmailConfirmation = async () => {
    const emailData = {
      emailUser: process.env.NEXT_PUBLIC_EMAIL_USERNAME, // replace with your email
      emailPass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,    // replace with your email password
      recipientEmails: [formData.email],    // driver's email
      senderName: "EtherWheels - A Ride Sharing Platform",             // sender name
      subject: "Passenger Registration Confirmation",
      placeholders: {
        name: formData.name,
      },
      templateId: 2, // Assuming you have a template for registration confirmation
    };

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      console.log("Email response:", result);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return (

    <div className={styles.container}>
      <h1>Register as Passenger</h1>
      <form onSubmit={handleSubmit}>

        <fieldset>
          <legend>Your details:</legend>

          <div className={styles.formGroup}>
            <label className={styles.label} >Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="age">Age:</label>
            <input
              type="text"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <Link
            href={{
              pathname: "/get-rides",
              query: {
                connectedAccount: connectedAccount,
                balance: balance,
                role: "passenger",
              },
            }}
            style={{ marginTop: "auto" }}
          >
            <button type="submit" className={`${styles.submitButton} ${styles.center__relative}`}>Submit</button>
          </Link>
        </fieldset>
        {/* <div className={styles.formGroup}>
          
          <label className={styles.label} htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="age">
            Age:
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="gender">
            Gender:
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">
            Phone:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
  */}
      </form>
    </div>
  );
};

export default PassengerRegistration;


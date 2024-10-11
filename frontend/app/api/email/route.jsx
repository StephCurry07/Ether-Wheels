"use server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const {
    emailUser,
    emailPass,
    recipientEmails,
    senderName,
    subject,
    placeholders,
    templateId,
  } = await req.json();
  
  console.log(
    emailUser,
    emailPass,
    recipientEmails,
    senderName,
    subject,
    placeholders,
    templateId
  );

  if (
    !emailUser ||
    !emailPass ||
    !recipientEmails.length ||
    !subject ||
    !templateId ||
    !senderName
  ) {
    return new Response(JSON.stringify({ error: "All fields are required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const templates = [
    {
      id: 1,
      template: "Hello [name],\n\nThis is a reminder about [event]. Please remember to [action].\n\nBest,\n[Your Name]",
      placeholders: ["name", "event", "action"]
    },
    {
      id: 2,
      template: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>Welcome to Carpool App, [name]!</h2>
          <p>Thank you for registering with EtherWheels.</p>
          <p>We are excited to have you on board and help you find or share rides conveniently.</p>
          <p>If you have any questions or need support, feel free to reach out.</p>
          <p>Best regards,</p>
          <p>EtherWheels Team</p>
        </div>
      `,
      placeholders: ["name"]
    },
    {
      id: 3,
      template: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
  <h2>Ride Creation Confirmation</h2>
  <p>Dear [name],</p>
  <p>Your ride has been successfully created!</p>
  <p><strong>Ride Details:</strong></p>
  <ul>
    <li><strong>Date & Time:</strong> [rideTime]</li>
    <li><strong>Pickup Location:</strong> [pickupLocation]</li>
    <li><strong>Destination:</strong> [destination]</li>
  </ul>
  <p>Thank you for offering to provide this ride. We will notify you when passengers book this ride.</p>
  <p>Safe travels!</p>
  <p>Best regards,</p>
   <p>EtherWheels Team</p>

</div>

      `,
      placeholders: ["name", "age", "rideTime", "pickupLocation", "destination"]
    },
    {
      id: 4,
      template: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>Ride Completed Successfully</h2>
          <p>Dear [name],</p>
          <p>We are happy to inform you that your ride with [driverName] has been successfully completed.</p>
          <p><strong>Ride Summary:</strong></p>
          <ul>
            <li><strong>Date & Time:</strong> [rideTime]</li>
            <li><strong>Pickup Location:</strong> [pickupLocation]</li>
            <li><strong>Destination:</strong> [destination]</li>
          </ul>
          <p>Thank you for choosing Carpool App. We hope you had a pleasant experience!</p>
          <p>We look forward to serving you again in the future. If you have any feedback or questions, feel free to reach out.</p>
          <p>Best regards,</p>
          <p>[Your Name] from Carpool App</p>
        </div>
      `,
      placeholders: ["name", "driverName", "rideTime", "pickupLocation", "destination"]
    }
  ];

  const selectedTemplate = templates.find((t) => t.id === parseInt(templateId));

  if (!selectedTemplate) {
    return new Response(JSON.stringify({ error: "Invalid template ID." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let emailContent = selectedTemplate.template;
  for (const [placeholder, value] of Object.entries(placeholders)) {
    emailContent = emailContent.replace(`[${placeholder}]`, value);
  }
  emailContent = emailContent.replace("[Your Name]", senderName);

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `${senderName} <${emailUser}>`,
      to: recipientEmails.join(","),
      subject: subject,
      html: emailContent, 
    });

    console.log("Message sent: %s", info.messageId);
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Error sending email",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
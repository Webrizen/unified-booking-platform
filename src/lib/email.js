import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD_GAPP,
  },
});

export const sendBookingConfirmationEmail = async (toEmail, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Booking Confirmation for ${bookingDetails.bookingType}`,
    html: `
      <h1>Your Booking is Confirmed!</h1>
      <p>Thank you for your booking. Here are the details:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${bookingDetails._id}</li>
        <li><strong>Type:</strong> ${bookingDetails.bookingType}</li>
      </ul>
      <p>We look forward to serving you.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};
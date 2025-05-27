import axios from 'axios';
export async function sendEmail(data: {
  from: {
    name: string;
  };
  to: {
    emailAddress: string[];
  };
  subject: string;
  text: string;
}): Promise<void> {
  const mailOptions = {
    from: {
      name: data.from.name
    },
    to: { emailAddresses: data.to.emailAddress },
    subject: data.subject,
    html: data.text
  };

  try {
    const result = await axios.post(`${process.env.EMAIL_SERVICE_URL}/email/send`, mailOptions, {
      headers: {
        'Content-Type': 'application/json',
        'X-SECRET-KEY': process.env.EMAIL_SERVICE_KEY || ''
      }
    });
    console.log('Email sent: ', result);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

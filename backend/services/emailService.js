const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendLobbyInvite({ toEmail, fromUsername, roomCode, lobbyUrl }) {
  const mailOptions = {
    from:    `"ClueLess Game" <${process.env.EMAIL_FROM}>`,
    to:      toEmail,
    subject: `${fromUsername} invited you to a game of ClueLess!`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: auto; padding: 32px; background: #F5E8D3; border-radius: 12px;">
        <h1 style="color: #7A5C46; font-size: 28px; margin: 0 0 8px;">🔍 ClueLess</h1>
        <p style="color: #3D2B1F; font-size: 16px;">
          <strong>${fromUsername}</strong> has invited you to join their game!
        </p>
        <div style="background: #fff; border: 2px solid #7A5C46; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
          <p style="color: #8c6f61; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Room Code</p>
          <p style="color: #3D2B1F; font-size: 32px; font-weight: 900; letter-spacing: 0.2em; margin: 0;">${roomCode}</p>
        </div>
        <a href="${lobbyUrl}" style="display: block; text-align: center; background: #A44A3F; color: #F5E8D3; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 16px; text-decoration: none;">
          Join the Game
        </a>
        <p style="color: #8c6f61; font-size: 12px; margin-top: 24px; text-align: center;">
          Or enter the room code manually at <a href="${process.env.CLIENT_URL}" style="color: #7A5C46;">${process.env.CLIENT_URL}</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendLobbyInvite };
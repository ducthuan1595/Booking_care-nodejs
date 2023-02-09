require("dotenv").config;
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
  // async..await is not allowed in global scope, must use a wrapper
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <thuan.truong.vo.cam@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: bodyHTMLEmail(dataSend),
  });
};

let bodyHTMLEmail = (dataSend) => {
  // console.log(dataSend.language);
  let result = "";
  if (dataSend.language == "vi") {
    result = `
    <h2>Xin chào, ${dataSend.patientName}</h2>
    <p>Bạn đã đặt lịch khám bệnh trên ứng dụng của chúng tôi</p>
    <p>Thông tin bạn đã đặt:</P> <h4>Thời gian: ${dataSend.time}</h4>
    <h4>Bác sĩ: ${dataSend.doctorName}</h4>

    <p>Nếu đúng là bạn vui lòng xác nhận hộ mình nha!</p>
    <a href=${dataSend.redirectLick} target="_blank">Xác nhận</a>
    <p>Cảm ơn! Chúc một ngày tốt lành</p>
    `;
  }
  if (dataSend.language == "en") {
    result = `
    <h2>Dear, ${dataSend.patientName}</h2>
    <p>Do you booked a schedule medical of us?</p>
    <p>information you booked:</P> <h4>Time: ${dataSend.time}</h4>
    <h4>Doctor: ${dataSend.doctorName}</h4>

    <p>If is you please, confirm for me!</p>
    <a href=${dataSend.redirectLick} target="_blank">Confirm</a>
    <p>Good day.</p>
    `;
  }
  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language == "vi") {
    result = `
    <h2>Xin chào, ${dataSend.patientName}</h2>
    <p>Bạn đã đặt lịch khám bệnh trên ứng dụng của chúng tôi</p>
    <p>Thông tin đơn thuốc được gửi trong file đính kèm.</P>

    <p>Cảm ơn! Chúc một ngày tốt lành</p>
    `;
  }
  if (dataSend.language == "en") {
    result = `
    <h2>Dear, ${dataSend.patientName}</h2>
    <p>This is bill of medicine when you care at the booking care</p>
    <p>Information medicine is be send in the attachment file</p>

    <p>Thank you, used our server!</p>
    <p>Good day.</p>
    `;
  }
  return result;
}

let sendAttachment = async(dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <thuan.truong.vo.cam@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split('base64,')[1],
        encoding: 'base64'
      },
    ]
  });
}

module.exports = {
  sendSimpleEmail,
  sendAttachment
};

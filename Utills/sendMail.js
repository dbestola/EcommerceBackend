const nodemailer = require('nodemailer')
const env = require('dotenv').config()


const sendmail = (send_to, subject, body) => {
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user: process.env.MAIL_PORT ,
            pass: process.env.PASS_PORT
        },
        tls:{
            rejectUnaauthorized: true,
        }
     
    })
    const options = {
        from: 'olanrewajuoladimeji5@gmail.com',
        to: send_to ,
        replyTo: 'support@gmail.com',
        subject: subject,
        // test: 'hello welcome to mail'
        html: body

    }

    transporter.sendMail(options, function(err,info){
        if(err){
            console.log(err);
            
        }else{
            console.log(info);
            
        }
    })
}

module.exports = sendmail
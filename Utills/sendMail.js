const nodemailer = require('nodemailer')


const sendmail = (send_to, subject, body) => {
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:"olanrewajuoladimeji5@gmail.com",
            pass:"lnmxmcwawpzeakhu"
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
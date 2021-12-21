

const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SendgridAPI_key)


const SendWelcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'abhishek@mail.com',
        subject:'This is first mail',
        text:`hey ${name}enjoyyy this maill`
    
    })
}

const SendCancelationMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'abhishek@mail.com',
        subject:'This is first mail',
        text:`hey ${name}plz back to us`
    
    })
}
module.exports={SendWelcomeMail,SendCancelationMail}
var nodemailer=require('nodemailer');
module.exports=function(email,subject ,content){
var transporter=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'salesforce1team@gmail.com',
        pass:'Nh321562630@'
    }
});
var mailOptions={
    from:'salesforce1team@gmail.com',
    to:email,
    subject:subject,
    text:content
};
transporter.sendMail(mailOptions,function(err,info){
    if(err){console.log(err);}
    else{console.log('Email sent: '+ info.response);}
});}
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
var nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser.json());

const secret = "pppppppppppppppppppppppppppppppp";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
});

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'user_database'
})

const encrypt = (pass) =>{
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);
    const password = pass;
    const encryptedPassword = Buffer.concat([
        cipher.update(password),
        cipher.final(),
    ]);
    return {
        iv: iv.toString("hex"),
        password: encryptedPassword.toString("hex"),
    };
}

const decrypt = (encryption) =>{
    const decipher = crypto.createDecipheriv("aes-256-ctr", Buffer.from(secret), Buffer.from(encryption.iv, "hex"));
    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryption.password,"hex")),
        decipher.final(),
    ]);

    return decryptedPassword.toString()
}

function getCode(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

app.get("/api",(req,res)=>{

})

app.post("/signup", (req, res)=>{

    const sql = 'SELECT id FROM user_data WHERE username = "'+ req.body.Username + '"';
    /// USERNAME EXISTS
    db.query(sql, (err, data)=>{
        if(err){return res.json(err);}
        if (data < 1){
            const sql_email = 'SELECT id FROM user_data WHERE email = "'+ req.body.Email + '"';
            /// EMAIL EXISTS
            db.query(sql_email, (err4, data4)=>{
                if(err4){return res.json(err4);}
                if (data4 < 1){
                    const user_input = req.body;
                    const encryptedPassword = encrypt(user_input.Password)
                    const sql_addUser = 'INSERT INTO `user_data` (`username`, `secret`, `email`, `dob`, `snack`) VALUES (?,?,?,?,?);';
                    
                    /// ADD ACCOUNT
                    db.query(sql_addUser, [user_input.Username, encryptedPassword.password, user_input.Email, user_input.DoB, encryptedPassword.iv], (err2, data2)=>{
                        if(err2){

                            return res.json(err2);
                        }
                        /// ACCOUNT VALIDATION
                        db.query(sql, (err3, data3)=>{
                            if(err3){
                                return res.status(201).send(err3);
                            }
                            if (data3[0]!==undefined){
                                res.status(201).send({message:"Account created successfully."})
                            }
                        })
                    })
                }else{
                    res.status(400).send({message:"This email is already exists."})
                }
            })
        }else{
            res.status(400).send({message:"This username is already exists."})
        }
    })
})

app.post("/signin", (req, res)=>{
    /// USERNAME EXISTS
    const sql = 'SELECT id FROM user_data WHERE username = "'+ req.body.Username + '"';
    db.query(sql, (err, data)=>{
        if(err){return res.json(err);}
        if (data[0]!==undefined){
            /// PASSWORD CHECK
            const sql = 'SELECT secret, snack FROM user_data WHERE username = "'+ req.body.Username + '"';
            db.query(sql, (err2, data2)=>{
                if(err2){return res.json(err2);}
                const dtb_password = data2[0].secret;
                const dtb_iv = data2[0].snack;
                const decryptedPassword = decrypt({password:dtb_password, iv:dtb_iv});
                if(decryptedPassword===req.body.Password){
                    return res.status(200).send({message:"Login successfully."})
                }else{
                    res.status(400).send({message:"Incorrect Username or Password."})
                }
            })
        }else{
            res.status(400).send({message:"Incorrect Username or Password."})
        }
    })
})

app.post("/verifyEmail", (req, res) =>{
    /// EMAIL EXISTS
    const sql = 'SELECT id FROM user_data WHERE email = "'+ req.body.Email + '"';
    db.query(sql, (err, data)=>{
        if(err){return res.json(err);}
        if (data[0]===undefined){
            res.status(400).send({message:"Incorrect Email"})
        }
        /// FOUND EMAIL
        const code = getCode(6).toUpperCase();

        /// SETUP EMAIL
        const email_address = req.body.Email;
        var mailOptions = {
          from: '',
          to: email_address,
          subject: 'Forgot password verification',
          text: "Your verification code is: " + code
        };

        /// SEND EMAIL
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.status(400).send({message:"Incorrect Email"})
            } else {
                /// SAVE TO DATABASE
                const sqlSave = 'INSERT INTO `user_database`.`verification_log` (`email`, `code`) VALUES ("'+ email_address + '","' + code +'");';
                db.query(sqlSave, (err, data)=>{
                    if(err){return res.json(err);}
                    res.status(200).send({message:"Email sent successfully"})
                })
            }
        });
    })
})

app.post("/verifyCode", (req, res) =>{
    /// EMAIL EXISTS
    const email_address = req.body.Email;
    const code_input = req.body.Code.toUpperCase();
    const sql = 'SELECT email, code, verification_id FROM user_database.verification_log WHERE email = "' + email_address +'" ORDER BY verification_id DESC;';
    db.query(sql, (err, data)=>{
        if(err){return res.json(err);}
        if (data[0]===undefined){
            res.status(400).send({message:"Incorrect Email"})
        }
        /// FOUND EMAIL
        if(code_input === data[0].code){
            res.status(200).send({message:"Verification successfully"})
        }else{
            res.status(400).send({message:"Incorrect Code"})
        }
    })
})

app.post("/passwordChange", (req, res)=>{
    const email_address = req.body.Email;
    const password_input = req.body.Password;
    /// RE-VERIFY
    const code_input = req.body.Code.toUpperCase();
    const sql = 'SELECT email, code, verification_id FROM user_database.verification_log WHERE email = "' + email_address +'" ORDER BY verification_id DESC;';
    db.query(sql, (err, data)=>{
        if(err){return res.json(err);}
        if (data[0]===undefined){
            res.status(400).send({message:"Something went wrong."})
        }
        if(code_input === data[0].code){
            /// SET PASSWORD
            const encryptedPassword = encrypt(password_input);
            const sql_password = 'UPDATE `user_database`.`user_data` SET `secret` = "'+encryptedPassword.password+'", `snack` = "'+encryptedPassword.iv+'" WHERE (`email` = "'+email_address+'");';
                    /// UPDATE
                    db.query(sql_password, (err2, data2)=>{
                        if(err){
                            return res.json(err2);
                        }
                        res.status(200).send({message:"Password has been successfully changed."})
                    })
        }else{
            res.status(400).send({message:"Something went wrong."})
        }
    })

})

app.listen(5000, () =>{console.log("Server started on port 5000")})


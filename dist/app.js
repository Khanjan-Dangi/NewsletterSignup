const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){

    const firstName = req.body.Fname;
    const lastName = req.body.Lname;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/39c2d52272";
    const API_K = process.env.NODE_APP_API_KEY;

    const option = {
        method: "POST",
        auth: "khanjan21:" + API_K
    };

    const request = https.request(url,option,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running!!");
});

//API key
//d4f8ac0255501af1f464bd900512c5ef-us21
//List ID
//39c2d52272

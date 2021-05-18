const exp = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = exp();

app.use(exp.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
    var firstname=req.body.firstName;
    var lastname = req.body.lastName;
    var email = req.body.emailAddress;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/5f1aad84a4";
    const options = {
        method: "POST",
        auth: process.env.GOOGLE_AUTH_TOKEN
    };

    const  request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
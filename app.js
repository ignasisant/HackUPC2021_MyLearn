const express = require("express");
const consolidate = require("consolidate");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();                                  // express app
const httpServer = require("http").createServer(app);   // create http server for socket.io compat

app.engine("html", consolidate.ejs);                    // EJS is our html render
app.set("view engine", "html");                         // html is our lang
app.set("views", path.join(__dirname, "/public/html")); // views for include with ejs
app.use(express.static("public"));                      // public folder
app.use(cookieParser());                                // parse cookies into json
app.use(bodyParser.json());                             // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));     // support encoded bodies

/*
Verify that user data is not modified on the front-end
*/

app.use((req, res, next) => {
    if (req.cookies.user)                                                       // user is logged
        jwt.verify(req.cookies.user, process.env.JWT_TOKEN, (err, data) => {        // verify user jwt cookie signature
            if (err || !data)                                                           // if ther is an error or no user data
                res.clearCookie("user");                                                    // delete user jwt cookie
            next();                                                                     // next middleware
        });
    else                                                                        // user is not logged
        next();                                                                     // next middleware
});

/*
Express routes
*/

app.use(require("./routes/main.js"));

/*
Last endpoint 404
*/

app.use((req, res, next) => {
    res.status(404).send("Error 404 - Data not found");
});

httpServer.listen(80, () => {
    console.log("HTTP server running in port", 80);
});
import express, { json, Application } from 'express';
import morgan from 'morgan';
import { Controller } from './controller/controller';
import { server_config } from './config/server.config';
import { ProfileRepositery } from './repositery/profile.repositery';
import path from 'path';
import bodyParser from 'body-parser';

export const app: Application = express();;


app.set("PORT", server_config.PORT || 3001)
app.set("HOST", server_config.HOST || "localhost")


ProfileRepositery.getInstance();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(json());
app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.static(path.resolve(__dirname, '..', 'public/js')));
app.use(express.static(path.resolve(__dirname, '..', 'public/css')));
app.use((req, res, next) => {
    let origin = req.headers.origin;
    if (origin == undefined) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'public/html/login.html'));
});

app.get('/otp.html', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'public/html/otp.html'));
});

app.get('/landing.html', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'public/html/landing.html'));
});

const controllers = new Controller().getController();
controllers.forEach((controller) => {
    app.use(controller.getRoutes());
});




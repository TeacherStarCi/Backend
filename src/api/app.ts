import express, {Application} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export default class App {
    app: Application;
    configBodyParser = ():void => {
        // support parsing of application/json type post data
    this.app.use(bodyParser.json());
  
//support parsing of application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    constructor(){
        this.app = express();
        this.configBodyParser();
        this.app.use(cors());
    }
} 
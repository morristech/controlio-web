// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import 'angular2-universal-polyfills';
import 'ts-helpers';
import './__workaround.node'; // temporary until 2.1.1 things are patched in Core

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';
// const cache = require('cache-control');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { MainModule } from './node.module';

// Routes
import { routes } from './server.routes';


// Bucket service
import { BucketService } from './bucket.service';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));




// Express View
app.engine('.html', createEngine({
  ngModule: MainModule,
  providers: [
    // use only if you have shared state between users
    // { provide: 'LRU', useFactory: () => new LRU(10) }

    // stateless providers only since it's shared
  ]
}));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

app.use(compression());

app.use(morgan('dev'));



function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', 'max-age=60');
  next();
}

function cacheControlAssets(req, res, next) {
  res.header('Cache-Control', 'max-age=36000');
  next();
}

// Serve static files
app.use('/assets', cacheControlAssets, express.static(path.join(__dirname, 'assets'), {maxAge: 36000}));
app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), {index: false}));


process.on('uncaughtException', function (err) {
  console.error('Catching uncaught errors to avoid process crash', err);
});

function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error)  {
    //console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', {root: './src'});
    return false;
  }

  Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
    res.render('index', {
      req,
      res,
      // time: true, // use this to determine what part of your app is slow only in development
      preboot: false,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: `http://localhost:${ app.get('port') }`
    });
  });

}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});



const bucket = new BucketService();
app.get('/img', function(req, res) {
  let key = req.query.key;
  if(!key){
    let json = JSON.stringify({ error: 'NOT_FOUND_KEY' });
    res.status(400).send(json);
    return;
  }
  // res.header('Cache-Control', 'max-age=36000');
  bucket.getImage(key,(err, ans)=>{
    if(err){
      let json = JSON.stringify({ key: key, err: err });
      res.status(400).send(json);
    }
    else {
      //let json = JSON.stringify({ key: key, res: ans });
      //res.send(ans);
      var options = {
        root: __dirname +  '/images',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'Cache-Control': 'max-age=2592000'
        }
      };

      var fileName = key;
      res.sendFile(fileName, options, function (err) {
        if (err) {
          let json = JSON.stringify({ key: key, err: err });
          res.status(500).send(json);
        } else {
          console.log('Sent:', fileName);
        }
      });
    }
  });
});


app.post('/upload', upload.array('image', 10), function (req: express.Request & { files: any }, res, next) {

  let key = req.body.key;
  if(!req.files){
    let json = JSON.stringify({ error: 'NOT_FOUND_FILES' });
    res.status(400).send(json);
    return;
  }

  if(!key){
    let json = JSON.stringify({ error: 'NOT_FOUND_KEY' });
    res.status(400).send(json);
    return;
  }

  let files = req.files;

  files.forEach((file)=>{
    bucket.uploadImage(key, file, (err, ans)=>{
      if(err){
        let json = JSON.stringify({ key: key, err: err });
        res.status(400).send(json);
      }
      else {
        res.send(ans);
      }
    });
  })
})
/*
app.post('/upload', multipartMiddleware, function(req: express.Request & { files: any }, res) {
  let key = req.body.key;
  if(!req.files){
    let json = JSON.stringify({ error: 'NOT_FOUND_FILES' });
    res.status(400).send(json);
    return;
  }

  if(!key){
    let json = JSON.stringify({ error: 'NOT_FOUND_KEY' });
    res.status(400).send(json);
    return;
  }

  let file = req.files.image;
  bucket.uploadImage(key, file, (err, ans)=>{

    console.log(file.path)
    // fs.unlink(file.path, (err: any)=>{
    //   console.log(err, res)
    // })

    if(err){
      let json = JSON.stringify({ key: key, err: err });
      res.status(400).send(json);
    }
    else {
      res.send(ans);
    }
  });
});*/


app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});


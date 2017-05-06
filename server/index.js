'use strict';

const express = require( 'express' );
const compression = require( 'compression' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const session = require( 'express-session' );
const logger = require( 'morgan' );
const uuid = require( 'uuid' );

// const routes = require( './routes' );

const app = express();

// configure
app.set( 'port', process.env.PORT || 8000 );
app.use( logger( 'dev' ) );
app.use( compression() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    extended: false
} ) );

app.use( cookieParser() );
app.use( session( {
    resave: true,
    saveUninitialized: true,
    secret: uuid.v1(),
    cookie: {
        maxAge: 86400000
    }
} ) );

// routes
// Object.keys( routes ).map( function( key ) {
//     app.use( routes[ key ] );
// } );
const email = require( './routes/email' );
const connect = require( './lib/connect' );

app.use( connect.connect );
app.use( '/', email );
app.use( express.static( __dirname + '/../public' ) );


// 404
app.use( function( req, res, next ) {
    res.status( 404 ).sendFile( __dirname + '/../public/404.html' );
} );

// maybe 500 dedicated pages

app.listen( app.get( 'port' ), function() {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );
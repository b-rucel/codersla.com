'use strict';

require( 'dotenv' ).config();
const express = require( 'express' );
const compression = require( 'compression' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
const jwt = require( 'jsonwebtoken' );
const session = require( 'express-session' );
const logger = require( 'morgan' );
const cookie = require( 'cookie' );
const uuid = require( 'uuid' );
const path = require( 'path' );

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

app.get( '/', ( req, res, next ) => {
    let key = process.env.JWT_KEY;
    let cookies = cookie.parse( req.headers.cookie || '' );

    if ( !cookies.token ) {
        const token = jwt.sign( { 'user-agent': req.headers[ 'user-agent' ], 'accept-encoding': req.headers[ 'accept-encoding' ] }, Buffer.from( key, 'hex' ) );
        res.cookie( 'token', token, { httpOnly: true } );    
    }

    next();
} );


const email = require( './routes/email' );
const connect = require( './lib/connect' );
app.use( connect.connect );
app.use( '/', email );
app.use( express.static( path.resolve( __dirname + '/../public' ) ) );


// 404
app.use( function( req, res, next ) {
    res.status( 404 ).sendFile( path.resolve( __dirname + '/../public/404.html' ) );
} );

// maybe 500 dedicated pages

app.listen( app.get( 'port' ), function() {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );
'use strict';

const r = require( 'rethinkdb' );
const router = require( 'express' ).Router();
const async = require( 'async' );
const connect = require( '../lib/connect' );
const cookie = require( 'cookie' );
const jwt = require( 'jsonwebtoken' );


router.get( '/email', ( request, response ) => {
    response.send( {
        get: 'email'
    } );
    // r.db( 'emails' ).table( 'emails' )
    //     .run( request._rdb )
    //     .then( cursor => cursor.toArray() )
    //     .then( result => {
    //         response.send( result );
    //     } )
    //     .catch( error => response.send( error ) );
} );


router.post( '/email', ( request, response ) => {
    let now = new Date().toISOString();
    let row = Object.assign( {}, request.body, { created: now } );

    async.series( [
        // check cookie
        next => {
            // if cookie isn't found then skip to the end
            if ( !( request.headers && request.headers.cookie ) ) {
                next( {
                    code: 102,
                    error: "You do not have permissions to perform this action."
                } );
                return;
            }

            let cookies = cookie.parse( request.headers.cookie );
            let key = process.env.JWT_KEY;

            jwt.verify( cookies.token, Buffer.from( key, 'hex' ), ( error, decoded ) => {
                if ( error ) {
                    next( {
                        code: 103,
                        error: "You do not have permissions to perform this action."
                    } );
                    return;
                }

                if ( decoded[ 'user-agent' ] !== request.headers[ 'user-agent' ] || decoded[ 'accept-encoding' ] !== request.headers[ 'accept-encoding' ] ) {
                    // should error out also here, should be interesting to see how many these come through
                    // next( {
                    //     code: 101,
                    //     error: "You do not have permissions to perform this action."
                    // } );
                    // return;
                }

                next();
            } );
        },

        // check dupe emails
        next => {
            r.db( 'emails' ).table( 'emails' )
                .filter( {
                    email: request.body.email
                } )
                .run( request._rdb )
                .then( cursor => cursor.toArray() )
                .then( result => {
                    if ( result.length > 0 ) {
                        next( {
                            error: `This email exists already: ${ 'me@brucelim.com' }`
                        } );
                        return;
                    }

                    next();
                } )
                .catch( error => { 
                    console.log( error );
                    next();
                } );
        },

        // insert
        next => {
            r.db( 'emails' ).table( 'emails' )
                .insert( row )
                .run( request._rdb )
                .then( result => {
                    if ( result ) {
                        response.send( {
                            success: true,
                            message: `${ request.body.email } was added successfully`
                        } );
                    }
                } )
                .catch( next );
        }
    ], error => {
        if ( error ) {
            console.log( error );
            response.send( error );
            return;
        }
    } );
} );


module.exports = router;
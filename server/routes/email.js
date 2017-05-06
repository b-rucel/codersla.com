'use strict';

const r = require( 'rethinkdb' );
const router = require( 'express' ).Router();
const connect = require( '../lib/connect' );

router.get( '/email', ( request, response ) => {
    // response.send( {
    //     get: 'email'
    // } );
    r.db( 'emails' ).table( 'emails' )
        .run( request._rdb )
        .then( cursor => cursor.toArray() )
        .then( result => {
            response.send( result );
        } )
        .catch( error => response.send( error ) );
} );

module.exports = router;
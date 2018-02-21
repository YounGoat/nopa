#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , man = noda.inRequire('lib/man')
    ;
    

man(process.argv.slice(2), {
    names: [ 'nopa' ],
    desc: 'Node.js packages assistant.',
});
var minimist = require('minimist');
var requireDir = require('require-dir');


var tenantOpts = {
    string: 'tenant',
    default: { tenant: 'example' }
}

var opts = minimist(process.argv, tenantOpts)

requireDir('./gulpfiles/' + opts.tenant,  { recurse: true })
var retext = require('retext');
var simplify = require('retext-simplify');
var remark2retext = require('remark-retext');
var control = require('remark-message-control');
var equality = require('retext-equality');
var parser = require('retext-english');
var remark = require('remark');
var sort = require('vfile-sort');
var mapboxStandard = require('./');
var stripLiquid = require('./strip_liquid');

var equalityConfig = {
    ignore: [
        'disabled', // technical
        'masterpiece', // not offensive enough
        'host', // technical
        'Fellow', // PIF
        'fellow', // PIF
        'fellowship', // PIF
        // sometimes we write about humans who identify with these gendered terms:
        'he',
        'him',
        'himself',
        'his',
        'he\'s',
        'he\'d',
        'boy',
        'boys',
        'son',
        'sons',
        'son\'s',
        'brother',
        'husband',
        'father',
        'paternity',
        'grandfather',
        'grandfathers',
        'man',
        'men',
        'masculinity',
        'she',
        'her',
        'herself',
        'hers',
        'girl',
        'girls',
        'she\'s',
        'she\'d',
        'women',
        'woman',
        'sister',
        'wife',
        'daughter',
        'daughter\'s',
        'daughters',
        'mom',
        'mother',
        'maternity',
        'grandmother',
        'grandmothers',
        'femininity',
        'pop', // other contexts are fine
        'crazy', // replacing with different suggestions
        'retard', // replacing with different suggestions
        'retarded', // replacing with different suggestions
        'steward', // we don't mean flight attendants
        'stewards', // we don't mean flight attendants
    ]
};

var simplifyConfig = {
    ignore: [
        'address', // geocoder
        'combined', // no good alternative
        'component', // technical
        'contains', // technical
        'delete', // this is what the UI says
        'effect', // technical
        'equivalent', // equal does not have identical connotation
        'function', // technical
        'implement', // technical
        'initial', // technical
        'interface', // technical
        'it is', // no good alternative
        'forward', // technical
        'maintain', // software term
        'maximum', // technical
        'might', // may does not have identical connotation
        'minimum', // technical
        'multiple', // many is not equivalent
        'option', // technical
        'parameters', // technical
        'procure', // technical government term
        'provide', // common in quotes
        'request', // technical
        'require', // technical
        'render', // technical
        'selection', // technical
        'submit', // technical
        'there are', // no good alternative
        'type', // technical
        'very', // too common, especially in quotes
    ]
};

var markdown = remark();
var english = retext()
    .use(parser)
    .use(mapboxStandard)
    .use(equality, equalityConfig)
    .use(simplify, simplifyConfig);

function standard(value) {
    var result;
    if (typeof value === 'string') {
        value = stripLiquid(value);
    } else {
        value.contents = stripLiquid(value.contents);
    }
    remark()
        .use(remark2retext, english)
        .use(control, {
            'name': 'mapbox'
        })
        .process(value, function (err, file, doc) {
            sort(file);
            result = file;
        });
    return result;
}

module.exports = standard;

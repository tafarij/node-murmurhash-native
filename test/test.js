var test = require("tap").test
  , hash = require('..')
  , isNode010 = isNodeAtLeast(0, 10);
;

function isNodeAtLeast(major, minor) {
  var ver = process.versions.node.split('.', 2);
  return ver[0] > major || (ver[0] == major && ver[1] >= minor);
}

[
  [4, 'murmurHash', hash.murmurHash, 0, -2114883783, 1364076727,
      '00000000', '396ff181', 'b7284e51',
      '377f2de7'],
  [8, 'murmurHash64x64', hash.murmurHash64x64,
      new Buffer('0000000000000000', 'hex'),
      new Buffer('313c2fa401422d95', 'hex'),
      new Buffer('dc64d05b93a7a4c6', 'hex'),
      '0000000000000000', '313c2fa401422d95', 'dc64d05b93a7a4c6',
      '9fd4eea49cf85e86'],
  [8, 'murmurHash64x86', hash.murmurHash64x86,
      new Buffer('0000000000000000', 'hex'),
      new Buffer('b08ac9f678ca07f1', 'hex'),
      new Buffer('485250799f019fdd', 'hex'),
      '0000000000000000', 'b08ac9f678ca07f1', '485250799f019fdd',
      '6acc55d0bb3be0bc'],
  [16, 'murmurHash128x64', hash.murmurHash128x64,
      new Buffer('00000000000000000000000000000000', 'hex'),
      new Buffer('ecc93b9d4ddff16a6b44e61e12217485', 'hex'),
      new Buffer('b55cff6ee5ab10468335f878aa2d6251', 'hex'),
      '00000000000000000000000000000000', 'ecc93b9d4ddff16a6b44e61e12217485',
      'b55cff6ee5ab10468335f878aa2d6251',
      '9b7f998ee773a51875585e59b4c4e90b'],
  [16, 'murmurHash128x86', hash.murmurHash128x86,
      new Buffer('00000000000000000000000000000000', 'hex'),
      new Buffer('a9081e05f7499d98f7499d98f7499d98', 'hex'),
      new Buffer('ecadc488b901d254b901d254b901d254', 'hex'),
      '00000000000000000000000000000000', 'a9081e05f7499d98f7499d98f7499d98',
      'ecadc488b901d254b901d254b901d254',
      'a00b69cf08b95f0d4d8b97b2eecb778d'],
].forEach(function(args) {

  var size                = args[0]
    , label               = args[1]
    , murmurHash          = args[2]
    , seedZeroDefault     = args[3]
    , seedMinusOneDefault = args[4]
    , seedPlusOneDefault  = args[5]
    , seedZeroHex         = args[6]
    , seedMinusOneHex     = args[7]
    , seedPlusOneHex      = args[8]
    , crashTestHex        = args[9]

  test(label, function(t) {

    t.type(murmurHash, 'function');

    t.test('should throw error for bad arguments', function(t) {
      t.throws(function() { murmurHash() }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash({}) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash([]) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(void(0)) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(null) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(true) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(false) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(0) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(1) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(-1) }, new TypeError("string or Buffer is required") );
      t.throws(function() { murmurHash(new Date()) }, new TypeError("string or Buffer is required") );
      t.end();
    });

    t.test('should create hash from empty data', function(t) {
      t.deepEqual(murmurHash(''), seedZeroDefault);
      t.deepEqual(murmurHash(new Buffer('')), seedZeroDefault);
      t.deepEqual(murmurHash('', -1), seedMinusOneDefault);
      t.deepEqual(murmurHash(new Buffer(''), -1), seedMinusOneDefault);
      t.deepEqual(murmurHash('', 4294967295), seedMinusOneDefault);
      t.deepEqual(murmurHash(new Buffer(''), 4294967295), seedMinusOneDefault);
      t.deepEqual(murmurHash('', 4294967296), seedZeroDefault);
      t.deepEqual(murmurHash(new Buffer(''), 4294967296), seedZeroDefault);
      t.deepEqual(murmurHash('', 1), seedPlusOneDefault);
      t.deepEqual(murmurHash(new Buffer(''), 1), seedPlusOneDefault);
      t.end();
    });

    if ( isNode010 ) {
      t.test('should create hex hash from empty data', function(t) {
        t.strictEqual(murmurHash('', 0, 'hex'), seedZeroHex);
        t.strictEqual(murmurHash(new Buffer(''), 'hex'), seedZeroHex);
        t.strictEqual(murmurHash('', -1, 'hex'), seedMinusOneHex);
        t.strictEqual(murmurHash(new Buffer(''), -1, 'hex'), seedMinusOneHex);
        t.strictEqual(murmurHash('', 4294967295, 'hex'), seedMinusOneHex);
        t.strictEqual(murmurHash(new Buffer(''), 4294967295, 'hex'), seedMinusOneHex);
        t.strictEqual(murmurHash('', 4294967296, 'hex'), seedZeroHex);
        t.strictEqual(murmurHash(new Buffer(''), 4294967296, 'hex'), seedZeroHex);
        t.strictEqual(murmurHash('', 1, 'hex'), seedPlusOneHex);
        t.strictEqual(murmurHash(new Buffer(''), 1, 'hex'), seedPlusOneHex);
        t.end();
      });
    }

    if ( isNode010 ) {
      t.test('should utilize different string input encodings', function(t) {
        var string = "\u1220łóżko"
          , base64 = '4YigxYLDs8W8a28='
          , hex = 'e188a0c582c3b3c5bc6b6f'
          , hash = murmurHash(string, 0, 'hex');
        t.strictEqual(hash,
           murmurHash(new Buffer(string), 'hex'));
        t.strictEqual(murmurHash(string, 'ascii', 0, 'hex'),
           murmurHash(new Buffer(string, 'ascii'), 'hex'));
        t.strictEqual(murmurHash(string, 'binary', 0, 'hex'),
           murmurHash(new Buffer(string, 'binary'), 'hex'));
        t.strictEqual(murmurHash(string, 'utf8', 0, 'hex'), hash);
        t.strictEqual(murmurHash(string, 'utf8', 0, 'hex'),
           murmurHash(new Buffer(string, 'utf8'), 'hex'));
        t.strictEqual(murmurHash(string, 'utf-8', 0, 'hex'),
           murmurHash(new Buffer(string, 'utf-8'), 'hex'));
        t.strictEqual(murmurHash(string, 'ucs2', 0, 'hex'),
           murmurHash(new Buffer(string, 'ucs2'), 'hex'));
        t.strictEqual(murmurHash(string, 'ucs-2', 0, 'hex'),
           murmurHash(new Buffer(string, 'ucs-2'), 'hex'));
        t.strictEqual(murmurHash(string, 'utf16le', 0, 'hex'),
           murmurHash(new Buffer(string, 'utf16le'), 'hex'));
        t.strictEqual(murmurHash(string, 'utf-16le', 0, 'hex'),
           murmurHash(new Buffer(string, 'utf-16le'), 'hex'));
        t.strictEqual(murmurHash(base64, 'base64', 0, 'hex'), hash);
        t.strictEqual(murmurHash(base64, 'base64', 0, 'hex'),
           murmurHash(new Buffer(base64, 'base64'), 'hex'));
        t.strictEqual(murmurHash(hex, 'hex', 0, 'hex'), hash);
        t.strictEqual(murmurHash(hex, 'hex', 0, 'hex'),
           murmurHash(new Buffer(hex, 'hex'), 'hex'));
        t.end();
      });
    }

    t.test('should create hash from some random data', function(t) {
      var data = '';
      for (var i = 0; i < 1000; ++i) data += String.fromCharCode((Math.random()*32768)|0);
      t.equal(murmurHash(data, 0, 'buffer').length, size);
      t.equal(murmurHash(new Buffer(data), 'buffer').length, size);
      t.deepEqual(murmurHash(data), murmurHash(new Buffer(data)));
      t.deepEqual(murmurHash(data, -1), murmurHash(new Buffer(data), -1));
      t.deepEqual(murmurHash(data, -1), murmurHash(new Buffer(data), 4294967295));
      t.deepEqual(murmurHash(data, 4294967295), murmurHash(new Buffer(data), -1));
      if ( isNode010 ) {
        t.strictEqual(murmurHash(data, 0, 'hex'), murmurHash(new Buffer(data), 'buffer').toString('hex'));
        t.strictEqual(murmurHash(data, 0, 'base64'), murmurHash(new Buffer(data), 'buffer').toString('base64'));
        t.strictEqual(murmurHash(data, 0, 'ucs2'), murmurHash(new Buffer(data), 'buffer').toString('ucs2'));
      }
      t.strictEqual(murmurHash(data, 0, 'ascii'), murmurHash(new Buffer(data), 'buffer').toString('ascii'));
      t.strictEqual(murmurHash(data, 0, 'binary'), murmurHash(new Buffer(data), 'buffer').toString('binary'));
      t.strictEqual(murmurHash(data, 0, 'utf8'), murmurHash(new Buffer(data), 'buffer').toString('utf8'));
      var seed = (Math.random()*4294967296)|0;
      t.deepEqual(murmurHash(data, seed), murmurHash(new Buffer(data), seed));
      t.end();
    });

    t.test('should not crash with utf8 characters in encoding string', function(t) {
      var hash = murmurHash("łabądź",
                 "\u1010\u1111\u1212\u1313\u1414\u1515\u1616\u1717",
                 "\u1010\u1111\u1212\u1313\u1414\u1515\u1616\u1717");
      t.type(hash, Buffer, 'hash is buffer');
      t.strictEqual(hash.toString('hex'), crashTestHex);
      t.end();
    });

    t.end();
  });

});

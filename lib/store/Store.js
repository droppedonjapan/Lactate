// Generic Store interface

var CacheItem = require('./CacheItem');
var expire = require('expire');

function Store(options) {
  this.count = 0;
  this.size = 0;
  this.expire = 1000 * 900;
  this.max_keys = Infinity;
  this.max_size = (1 << 20) * 100;
  this.segment = (1 << 10) * 200;
  !!options && this.setOptions(options);
};

Store.prototype._cache = Object.create(null);

Store.prototype.newItem = function(headers, data, expire) {
  return new CacheItem(headers, data, expire);
};

Store.prototype.now = function() {
  return Date.now();
};

Store.prototype.setOptions = function(key, val) {
  if (typeof key === 'object') {
    for (var k in key) {
      this.setOptions(k, key[k]);
    };
  } else {
    key = key.replace(/\s/g, '_');

    if (!this.hasOwnProperty(key)) return;

    switch(key) {
      case 'expire':
        if (typeof val === 'string')
          val = expire.getSeconds(val);
        break;
      case 'max_size':
          val = (1 << 20) * val;
        break;
    };

    this[key] = val;
  };
};

module.exports = Store;
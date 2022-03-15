const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error with create (getting id)');
    } else {
      items[id] = text;
      var file = exports.dataDir + '/' + id + '.txt';
      fs.writeFile(file, text, (err) => {
        if (err) {
          console.log('error with create (writing)');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir + '/', (err, files) => {
    if (err) {
      console.log('error with readall');
    } else {
      var data = files.map((file) => {
        var currentId = file.slice(0, file.length - 4);
        return {id: currentId, text: currentId};
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  fs.readFile(exports.dataDir + '/' + id + '.txt', function (err) {
    if (err) {
      callback(new Error('error with update'));
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function(err) {
        if (err) {
          callback(new Error('error with update'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  fs.unlink(exports.dataDir + '/' + id + '.txt', function(err) {
    if (err) {
      callback('error with delete');
    } else {
      callback(null, id);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

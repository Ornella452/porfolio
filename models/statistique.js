const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  jours: { 
    type: Date,
     default: Date.now
     }

});

const Stat = mongoose.model('Statistique-Cv', StatSchema);

module.exports = Stat;
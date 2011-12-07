
/*
 * GET advent calendar.
 */

var handler = require('../requestHandler');

exports.index = function(req, res){
  handler.getDays(req, function(days) {
    res.render('index', { title: 'HTML5 ADVENTURE CALENDAR', days: days });
  });
};

exports.getDayDetails = handler.getDayDetails;
exports.takePart = handler.takePart;

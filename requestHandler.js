// Copyright 2011 Thomas Oberndörfer (toberndo@yarkon.de)
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

var url = require('url');
var querystring = require('querystring');
var time = require('./time');
var fs = require('fs');

// cheat parameter to set a certain dayData
var CHEAT_PARA = 'should_be_secret';
var PARTICIPANTS_FN = 'participants';

exports.getDayDetails = getDayDetails;
exports.getDays = getDays;
exports.takePart = takePart;

function getDayDetails(request, response) {
  
  var urlQuery = url.parse(request.url).query;
  var qs = querystring.parse(urlQuery);
  var day = qs.day;
  var cheat = qs[CHEAT_PARA];
  // only valid days
  var regDay = /^([1-9]|[0-2][0-9]|3[0-1])$/;
  console.log('Day: ' + day);
  if (!regDay.test(day)) throw { name: 'wrong day', message: 'not in range 1-31' };
  
  // omit leading 0
  day = +day;
  
  var currLocalDate;
  
  console.log('cheat: ' + cheat);
  if (cheat === undefined) {
    currLocalDate = time.getLocalDate();
  } else {
    currLocalDate = time.getCheatDate(cheat);
  }
  console.log('currLocalDate: ' + currLocalDate);
  
  var targetDate = time.getTargetDate(day);
  
  if (targetDate.getTime() > currLocalDate.getTime()) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write('Not yet!');
    response.end();
  } else {
    fs.readFile('./details.json', 'utf8', function(err, data) {
      if (err) throw { name: 'read file error', message: 'can\'t open details.json' };
      var details = JSON.parse(data);
      var dayData = details['day' + day];
      dayData.tst = currLocalDate.toLocaleString();
      dayData.day = currLocalDate.getDate();
      var dayStr = JSON.stringify(dayData);
      if (!dayStr) dayStr = '{ }';
      endResponse(response, dayStr, qs.callback); 	
    });
  }

}

function endResponse(res, content, jsonp) {
  if (jsonp) {
    // JSONP
    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8", "Access-Control-Allow-Origin": "*"});
  } else {
    // JSON
    res.writeHead(200, {"Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*"});
  }
  if (jsonp) content = jsonp + '(' + content + ')'
  res.write(content);
  res.end('\n');
}

function getDays(req, result) {
  fs.readFile('./details.json', 'utf8', function(err, data) {
      if (err) throw { name: 'read file error', message: 'can\'t open details.json' };
      var details = JSON.parse(data);
      // add active flag
      var urlQuery = url.parse(req.url).query;
      var qs = querystring.parse(urlQuery);
      var cheat = qs[CHEAT_PARA];
  
      var currLocalDate;
  
      if (cheat === undefined) {
        currLocalDate = time.getLocalDate();
      } else {
        currLocalDate = time.getCheatDate(cheat);
      }
  
      // date when calendar starts
      var targetDate = time.getTargetDate(1);
  
      var currDay = currLocalDate.getDate();    
      
      if (targetDate.getTime() <= currLocalDate.getTime()) {
    
        for(i = 1; i <= currLocalDate.getDate(); i++) {
          if (details['day' + i]) details['day' + i].active = true;
        }
    
      }
    
      result(details);       
  });
}

function takePart(req, res) {
  var answer = {};
  
  var urlQuery = url.parse(req.url).query;
  var qs = querystring.parse(urlQuery);
  var cheat = qs[CHEAT_PARA];
  
  if (cheat === undefined) {
    currLocalDate = time.getLocalDate();
  } else {
    currLocalDate = time.getCheatDate(cheat);
  }
  
  var inDay = new Date(req.body.tst);
  console.log('inDay: ' + inDay);
  
  // check if timestamp is from today
  if (!(inDay.getDate() == currLocalDate.getDate() && inDay.getMonth() == currLocalDate.getMonth())) {
    answer.type = 'error';
    answer.message = 'It\'s too late for this door!';
    res.send(answer);
    return;
  }
  var participant = JSON.stringify(req.body);
  var filename = PARTICIPANTS_FN;
  if (process.env.VMC_APP_PORT) {
    filename += '_vmc.txt';
  } else {
    filename += '_local.txt';
  }
  fs.open(filename, 'a', 0666, function( e, id ) {
    fs.write( id, participant + '\n', null, 'utf8', function(){
      fs.close(id, function(){
        console.log('file closed');
        answer.type = 'success';
        answer.day = currLocalDate.getDate();
        answer.message = 'You take part in the tombola!';
        res.send(answer);
      });
    });
  });
}

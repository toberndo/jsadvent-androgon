// Copyright 2011 Thomas Oberndörfer (toberndo@yarkon.de)
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

exports.getLocalDate = getLocalDate;
exports.getTargetDate = getTargetDate;
exports.getCheatDate = getCheatDate;

var TZ_CET = +1;
var TARGET_YEAR = 2011;
var TARGET_MONTH = 11; // december

function getLocalDate() {
  // create Date object for system
  var d = new Date();
  return convertToLocal(d, TZ_CET);
}

function convertToLocal(date, offset) {
  // convert to UTC
  var utc = convertToUTC(date);
  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc.getTime() + (3600000*offset));
  // return time
  return nd;
}

function convertToUTC(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());  
}

function getTargetDate(day) {
  var d = getLocalDate(TZ_CET);
  d.setDate(day);
  d.setMonth(TARGET_MONTH);
  d.setFullYear(TARGET_YEAR);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  return d;
}

function getCheatDate(day) {
  var d = new Date();
  d.setDate(day);
  d.setMonth(TARGET_MONTH);
  d.setFullYear(TARGET_YEAR);
  return d;
}
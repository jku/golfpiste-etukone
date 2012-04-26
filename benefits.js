/*  Golfpiste.com membership benefit managing application
    Copyright (C) Jussi Kukkonen

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function parse_date (date_string)
{
  day = 1;
  month = 0;
  year = new Date().getFullYear();

  var arr = date_string.split (".", 3);
  if (arr [2])
    year = parseInt (arr[2]);

  if (arr[0] && arr[1]) {
    day = parseInt (arr[0]);
    month = parseInt (arr[1]) - 1;
    return new Date(year, month, day);
  } else {
    return null;
  }

}

function parse_time (base_date, time_string)
{
  var date = new Date (base_date);
  var hour = 0;
  var min= 0;
  var arr = time_string.split (":", 2);

  if (!arr [0])
    return  null;

  date.setHours (parseInt (arr[0]));
  if (arr [1])
    date.setMinutes (parseInt (arr[1]));
  else
    date.setMinutes (0);    
  date.setSeconds (0);

  return date;
}


function date_span_in_limit (span_start, span_end, limit)
{
  if (limit.start_date) {
    start_date = parse_date (limit.start_date);
    if (start_date > span_end)
      return false;
  }

  if (limit.end_date) {
    end_date = parse_date (limit.end_date);
    if (end_date < span_start)
      return false;
  }

  if (limit.weekdays) {
    var span_days = (span_end - span_start) / (1000*60*60*24);
    var day = span_start.getDay() - 1;
    var weekday_match = false;

    if (day == -1)
      day = 6;
 
    for (var i = 0; i < span_days; i++) {
      if (limit.weekdays[day])
        weekday_match = true;

      day++;
      if (day > 6)
        day = 0;
    }
    
    if (!weekday_match)
      return false;
  }

  if (limit.start_time) {
    start_time = parse_time (span_start, limit.start_time);
    if (start_time > span_end)
      return false;
  }

  if (limit.end_time) {
    end_time = parse_time (span_end, limit.end_time);
    if (end_time < span_start)
      return false;
  }

  return true;
}


function get_benefits (benefits, start_date, end_date)
{
  var valid_benefits = new Array(0);

  for (var i in benefits) {
    var benefit = benefits[i];
    var is_valid = true;
      
    if (start_date && end_date) {
      is_valid = false;
      var today = new Date ();

      if (!benefit.limits || benefit.limits.length == 0)
        is_valid = true;

      for (var k in benefit.limits) {
        if (date_span_in_limit (start_date, end_date, benefit.limits[k])) {
          is_valid = true;
          break;
        }
      }
    }

    if (is_valid)
      valid_benefits.push (benefit);
  }

  return valid_benefits;
}

# jsadvent-androgon

HTML5 advent calendar that can be used for tombolas.
The user can take part in a competition and the address data is stored in a node.js backend.

## Origin

This is a fork of a project originally developed by Zingchart:

    HTML5/CSS/JS advent calendar developed by Zingchart ( http://zingchart.com ) and PINT ( http://pint.com )
    for the http://html5advent.com 2010 site. May more advents blossom online.  Use at will per MIT license 
    though we would love to see cross linking. Promote the original site and we'll help with some traffic as well!
    Happy Holidays.
    
## Architecture

  - HTML5 and jQuery UI as in the original jsadvent project
  - Express Framework for the node.js backend
  - Jade Template Engine for views
  - notjustagrid.com for forms layout
  
## Requirements

  - node.js
  - npm

## Installation

Install required dependencies in the root directory of the project with:

    npm install
    
## Configuration

### public/javascripts/androgon.js

Set host of node.js backend:

    androgon.host = 'localhost:3000';
    
### requestHandler.js

Set cheat parameter

    var CHEAT_PARA = 'should_be_secret';
    
This URL parameter allows to look behind doors that are not yet open :)

E.g.

    http://localhost:3000/?should_be_secret=10
    
Set participants filename:

    var PARTICIPANTS_FN = 'participants';
    
Currently the JSON address data of participants is directly written to a file.

### time.js

Set timezone:

    var TZ_CET = +1;
    var TARGET_YEAR = 2011;
    var TARGET_MONTH = 11; // december
    
Month and Year of the advent calendar. Currently only one fixed timezone for all users

### details.json

JSON file that defines data to be displayed for each day of the calendar:

    "day1": {
    "date": "December 1st",
    "title": "Feature Title",
    "p1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus malesuada, libero at lacinia ornare, tellus tellus fermentum est, ac iaculis libero leo eget diam.",
    "p2": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus malesuada, libero at lacinia ornare, tellus tellus fermentum est, ac iaculis libero leo eget diam.",
    "p3": "<a href='http://www.google.com' target='_blank'>Your link here</a><br/><a href='http://www.github.com' target='_blank'>another one</a><br/>",
    "p4": "",
    "mood": "images/temp2.jpg",
    "href": "http://www.zingchart.com",
    "thumb": "images/temp1.jpg",
    "short": "Day 1" }

## Live example

At the time of writing the app was hosted on cloudfoundry.com under the following URL:

    http://androgon-advent.cloudfoundry.com/
    
## Licence

Use of this source code is governed by a MIT-style license that can be found in the LICENSE file.




    
    
    
    
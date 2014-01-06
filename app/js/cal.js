var clientId = '327144861423-qvti1t2nnfa1o4n0d2eo9ra3td3ahi01.apps.googleusercontent.com';
//var apiKey = 'ZKD2IYG6YpL1X5h7LobqPi3Z';
var scopes = 'https://www.googleapis.com/auth/calendar';

function handleClientLoad() {
  window.setTimeout(checkAuth,1);
  checkAuth();
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
      handleAuthResult);
}

var authDone = false;

function handleAuthResult(authResult) {
    if (authDone)
        return;
    authDone = true;
    
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult) {
    authorizeButton.style.visibility = 'hidden';
    startApp();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
   }
}

function handleAuthClick(event) {
  gapi.auth.authorize(
      {client_id: clientId, scope: scopes, immediate: false},
      handleAuthResult);
  return false;
}

var today = new Date();
var days = 2;
var endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

var calendars = [{name: 'Harvard Gazette', id: 'mf6mc2mkd3gtdearr8h0eskfqm2ei2e7@import.calendar.google.com'}];
var eventsCalendar = {name: 'Events', id: 'mdsdkju7poou6ngocrij0b1460@group.calendar.google.com'};

/* use a function for the exact format desired... */
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}

function fetchEvents(cal, cb) {
    console.log('fetching events for: ', cal.name);
    var params = {
        timeMin: ISODateString(today),
        timeMax: ISODateString(endDate),
        //timeMin: {dateTime: ISODateString(today)},
        //timeMax: {dateTime: ISODateString(endDate)},
        calendarId: cal.id
    }
    var request = gapi.client.calendar.events.list(params);
    console.log(' params: ' + JSON.stringify(params));
    request.execute(function(resp) {
        console.log('response for ' + cal.name);
        if (resp.items) {
            localStorage[cal.id] = resp;
            resp.items.forEach(function(r) {
                console.log(' ' + r.summary);
            });
            if (cb)
                cb(resp);
        } else {
            console.log(' no items');
        }
    });
}

function fetchAllCalendars() {
    fetchEvents(eventsCalendar);
    calendars.forEach(fetchEvents);
}

function apiLoaded() {
    console.log('api loaded');
    fetchAllCalendars();
}

function startApp() {
    gapi.client.load('calendar', 'v3', apiLoaded);
}

/*
function xstartApp() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.list({
        'calendarId': calendars[0].id;
    });
          
    request.execute(function(resp) {
      for (var i = 0; i < resp.items.length; i++) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(resp.items[i].summary));
        document.getElementById('events').appendChild(li);
      }
    });
  });
}
*/
var GCalMgr = function() {
    var self = this;
    self.clientId = '327144861423-qvti1t2nnfa1o4n0d2eo9ra3td3ahi01.apps.googleusercontent.com';
    self.scopes = 'https://www.googleapis.com/auth/calendar';  
    self.authDone = false;
    
    // Handlers
    self.handlers = {
        clientLoad: function() {self.handleClientLoad();},
        authResult: function(authResult) {self.handleAuthResult(authResult);},
        checkAuth: function() {self.checkAuth();},
        authClick: function(e) {self.handleAuthClick(e);},
        apiLoaded: function() {self.handleApiLoaded();}
    };
}

GCalMgr.prototype.handleClientLoad = function() {
    var self = this;
    window.setTimeout(self.handlers.checkAuth,1);
    self.handlers.checkAuth();
}

GCalMgr.prototype.checkAuth = function() {
    var self = this;
    gapi.auth.authorize({client_id: self.clientId, scope: self.scopes, immediate: true}, self.handlers.authResult);
}

GCalMgr.prototype.handleAuthResult = function(authResult) {
    var self = this;
    if (self.authDone)
        return;
    self.authDone = true;
    
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult) {
        authorizeButton.style.visibility = 'hidden';
        self.startApp();
    } else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = self.handlers.authClick;
    }
}

GCalMgr.prototype.handleAuthClick = function(event) {
  gapi.auth.authorize(
      {client_id: clientId, scope: scopes, immediate: false},
      self.handlers.authResult);
  return false;
}

/* use a function for the exact format desired... */
GCalMgr.prototype.ISODateString = function(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}

GCalMgr.prototype.fetchEvents = function(cal, cb) {
    var self = this;
    var today = new Date();
    var days = 2;
    var endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    console.log('fetching events for: ', cal.name);
    var params = {
        timeMin: self.ISODateString(today),
        timeMax: self.ISODateString(endDate),
        calendarId: cal.id
    }
    var request = gapi.client.calendar.events.list(params);
    console.log(' params: ' + JSON.stringify(params));
    request.execute(function(resp) {
        console.log('response for ' + cal.name);
        console.log('  ' + JSON.stringify(resp));
        if (resp.items) {
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

GCalMgr.prototype.fetchAllCalendars = function() {
    var self = this;
    var calendars = eventMgr.calendars;
    for (cID in calendars) {
        var cal = calendars[cID];
        self.fetchEvents(cal, function(events) {
            eventMgr.updateCalendarEvents(cal, events);
        });
    }
}

GCalMgr.prototype.handleApiLoaded = function() {
    var self = this;
    console.log('api loaded');
    self.fetchAllCalendars();
}

GCalMgr.prototype.startApp = function() {
    var self = this;
    gapi.client.load('calendar', 'v3', self.handlers.apiLoaded);
}
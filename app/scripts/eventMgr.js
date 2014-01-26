var EventMgr = function() {
    var self = this;
    
    // Indexed by event ID
    // Information about events that we get from the calendar
    // may include some data that is computed but does not need to be persisted
    self.events = {};

    // Indexed by event ID.
    // Information about events that we add and want to persist
    self.eventAnnotations = {};

    // Indexed by calendar ID
    // Information about calendars that is persisted
    self.calendars = {'mf6mc2mkd3gtdearr8h0eskfqm2ei2e7@import.calendar.google.com': {name: 'Harvard Gazette'}};

    //var eventsCalendar = {name: 'Events', id: 'mdsdkju7poou6ngocrij0b1460@group.calendar.google.com'};
    // Annotate calendar with ID
    for (k in self.calendars) {
        var cal = self.calendars[k];
        cal.id = k;
        cal.eventIDs = [];
    }
}

EventMgr.prototype.updateCalendarEvents = function(cal, events) {
    var self = this;
    
    // Delete the old events for this calendar
    cal.eventIDs.forEach(function(eID){
        self.events[eID] = null;
    });
    cal.eventIDs = [];
    
    // Add them all back
    events.items.forEach(function(e){
        var eID = e.id;
        self.events[eID] = e;
        cal.eventIDs.push(eID);
    });
    
    viewMgr.refresh();
}
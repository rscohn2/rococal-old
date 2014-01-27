var ViewMgr = function() {
    var self = this;

    self.ready = false;
    self.eventList = [];    
}

// Private functions
ViewMgr.prototype.renderEventList = function() {
    var self = this;
    var html = '';
    self.eventList.forEach(function(eID) {
        var e = eventMgr.events[eID];
        var o = {
            start: moment(e.start.dateTime).format('h:mm A'),
            end: moment(e.end.dateTime).format('h:mm A'),
            location: e.location,
            summary: e.summary,
            id: e.id
        };
        html = html + Mustache.render(self.tpl.listItem, o);
    });
    self.container.eventsUL.html(html);
}

ViewMgr.prototype.makeEventList = function() {  
    var self = this;
    var el = [];
    for (k in eventMgr.events) {
        el.push(k);
    }
    self.eventList = el;
}

ViewMgr.prototype.renderDetails = function() {
    var self = this;
    var e = eventMgr.events[self.detailsEID];
    var o = {
        summary: e.summary,
        description: e.description,
        location: e.location,
        calendar: e.creator.displayName,
        begin: moment(e.start.dateTime).format('dddd, MMMM D, h:mm A'),
        end: moment(e.end.dateTime).format('h:mm A')
    };
    var html = Mustache.render(self.tpl.eventDetails, o);
    self.container.detailsDiv.html(html);
}

// Public functions
ViewMgr.prototype.domReady = function() {
    var self = this;
    self.tpl = {
        listItem: $('#listItemTpl').html(),
        eventDetails: $('#eventDetailsTpl').html()
    };
    self.container = {
        eventsUL: $('#eventsUL'),
        detailsDiv: $('#detailsDiv')
    };
    self.ready = true;
    self.refresh();
}

ViewMgr.prototype.refresh = function() {
    var self = this;
    if (!self.ready) return;
    
    self.makeEventList();
    self.renderEventList();
}

ViewMgr.prototype.refreshDetails = function(id) {
    var self = this;
    self.detailsEID = id;
    self.renderDetails();
}


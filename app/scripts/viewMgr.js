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
        html = html + Mustache.render(self.listItemTpl, eventMgr.events[eID]);
    });
    self.$listUL.html(html);
}

ViewMgr.prototype.makeEventList = function() {  
    var self = this;
    var el = [];
    for (k in eventMgr.events) {
        el.push(k);
    }
    self.eventList = el;
}

// Public functions
ViewMgr.prototype.domReady = function() {
    var self = this;
    self.listItemTpl = $('#listItemTpl').html();
    self.$listUL = $('#eventsList');
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
    console.log('Details loaded: ' + id);
}


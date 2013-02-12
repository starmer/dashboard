var JenkinsWidget = {
	refresh : function(){
		// this.render inside ajax callback?
	},
	refreshRate : 100,
	template : "<div></div>"
};

var IFrameWidget = {
	refresh : function(){
		
	},
	refreshRate : 100,
	template : ""
};

DashApp = {
	pages : [],

	initialize : function(options){
		$.extend(this, options);

		this.setupPages();
	},

	setupPages : function(){
		for(var i = 0; i < this.pages.length; i++){
			var page = this.pages[i];

			this.setupPageView(page);

			for(var j = 0; j < page.widgets.length; j++){
				var widget = page.widgets[j];
				eval("var type = " + widget.type);
				$.extend(widget, type);

				this.schedule(widget);

				this.setupWidgetView(widget, page);
			}
		}
	},

	// refactor: add this method to page object?
	setupPageView : function(page){
		page.viewId = this.generateId();
		$("#" + DashApp.viewId).append('<div id="' + page.viewId + '"></div>');
	},

	// refactor: add this method to widget object?
	setupWidgetView : function(widget, page){
		widget.viewId = this.generateId();
		$("#" + page.viewId).append('<div id="' + widget.viewId + '"></div>');
	},

	intervals : [],
	
	schedule : function(refreshable){
		var intervalId = setInterval(function(){
			refreshable.refresh();
		}, refreshable.refreshRate);
		this.intervals.push(intervalId);
	},

	cleanUp : function(){
		while(this.intervals.length > 0){
			clearInterval(this.intervals.pop());
		}
	},

	generateId : function(){
		return Math.floor(Math.random() * 1000000000);
	}
};


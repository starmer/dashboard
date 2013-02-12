var JenkinsWidget = {
	refresh : function(){
		console.log("JenkinsWidget refresh");
		// this.render
	},
	refreshRate : 100,
	template : "<div></div>"
};

var IFrameWidget = {
	refresh : function(){
		console.log("IFrameWidget refresh");
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
			for(var j = 0; j < page.widgets.length; j++){
				var widget = page.widgets[j];
				eval("var type = " + widget.type);
				console.log(type.refreshRate);
				$.extend(widget, type);

				this.schedule(widget);

				widget.viewId = this.generateId();
			}
		}
	},

	intervals : [],
	schedule : function(widget){
		var intervalId = setInterval(function(){
			widget.refresh();
		}, widget.refreshRate);
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


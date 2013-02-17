var ProtoWidget = {
	viewId : null,
	initialize : function(){
		this.viewId = DashApp.generateId();
	},
	schedule : function(){
		var widget = this;
		setInterval(function(){
			widget.refresh();
		}, widget.refreshRate);
	},
};

var JenkinsWidget = {
	url : null,
	parsedData : null,
	refresh : function(){
		widget = this;
		$.ajax({
			url: widget.getRestUrl(),
			jsonpCallback: 'callback_' + widget.viewId,
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(json) {
				widget.render(json);
			}
		});
	},
	getRestUrl : function(){
		return this.url + "/lastCompletedBuild/testReport/api/json?jsonp=?";
	},
	render : function(json){
		this.parseData(json);
		var renderedView = Mustache.render(this.template, this);
		$("#" + this.viewId).replaceWith(renderedView);
	},
	parseData : function(json){
		this.data = {
			failed_tests : json.failCount,
			total_tests : json.totalCount || json.passCount,
			status : (json.failCount == 0) ? "success" : "fail"
		};
	},

	template : '<div class="build success"><div class="indicator"></div><div class="info"><div class="tests">{{data.failed_tests}} / {{data.total_tests}}</div><div class="name">{{name}}</div></div></div>'
};

var IFrameWidget = {
	refresh : function(){
		
	},
	refreshRate : 10000,

	template : ""
};

$.extend(IFrameWidget, ProtoWidget);
$.extend(JenkinsWidget, ProtoWidget);

var GroupWidget = {
	name : null,
	widgets : []
}

DashApp = {
	pages : [],
	pageTemplate : '<div class="page" id="{{viewId}}" style="display:none;"><div class="title">{{name}}<div></div>',
	initialize : function(options){
		$.extend(this, options);

		this.setupPages();
		this.setupPageCycling();
	},

	setupPageCycling : function(){
		
		$("#" + DashApp.pages[0].viewId).show();
		DashApp.currentPageIndex = 0;

		setInterval(function(){
			
			var nextIndex = DashApp.currentPageIndex + 1;
			if(nextIndex == DashApp.pages.length){
				nextIndex = 0;
			}

			var $currentPage = $("#" + DashApp.pages[DashApp.currentPageIndex].viewId);
			var $nextPage = $("#" + DashApp.pages[nextIndex].viewId)
			
			$currentPage.fadeOut(600, function(){
				$nextPage.fadeIn(600);
			});
			
			DashApp.currentPageIndex = nextIndex;
		}, DashApp.pageCycleTime);
	},

	setupPages : function(){
		for(var i = 0; i < this.pages.length; i++){
			var page = this.pages[i];

			this.setupPageView(page, i);

			for(var j = 0; j < page.widgets.length; j++){
				
				// todo this might be better placed in a widget object or service/helper obj?, widget.init
				eval("var type = " + page.widgets[j].type);
				page.widgets[j] = $.extend({}, type, page.widgets[j]);
				widget = page.widgets[j];
				widget.initialize();

				// todo this should be something like page.addWidget
				this.setupWidgetView(widget, page);
				widget.schedule();
			}
		}
	},

	// refactor: add this method to page object?
	setupPageView : function(page, index){
		page.viewId = "page_" + index;
		var renderedPageView = Mustache.render(DashApp.pageTemplate, page);
		$("#" + DashApp.viewId).append(renderedPageView);
	},

	// refactor: add this method to widget object?
	setupWidgetView : function(widget, page){
		//var html = widget.getViewHTML();
		//page.addSubViewHTML();

		$("#" + page.viewId).append('<div id="' + widget.viewId + '" >Loading</div>');
	},

	generateId : function(){
		return Math.floor(Math.random() * 1000000);
	}
};


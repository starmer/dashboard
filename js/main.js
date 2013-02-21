var BuildWidget = {
	url : null,
	parsedData : null,
	initialize : function(){
		this.viewId = DashApp.generateId();
		this.schedule();
	},
	refresh : function(){
		var widget = this;
		var success = function(json) {
			widget.render(json);
		};

		window['callback_' + widget.viewId] = function(json) {
			success(json);
		};

		$.ajax({
			url: widget.getRestUrl(),
			jsonpCallback: 'callback_' + widget.viewId,
			contentType: "application/json",
			dataType: 'jsonp',
			success: success
		});
	},
	render : function(json){
		this.parseData(json);
		var renderedView = Mustache.render(this.template, this);
		$("#" + this.viewId).replaceWith(renderedView);
	},
	getInitialView : function(){
		return '<div id="' + this.viewId + '" class="loading">Loading</div>';
	},
	schedule : function(){
		var widget = this;
		widget.refresh();
		setInterval(function(){
			widget.refresh();
		}, widget.refreshRate);
	},
	template : '<div class="build {{data.status}}" id="{{viewId}}"><div class="indicator"></div><div class="info"><div class="tests">{{data.failed_tests}} / {{data.total_tests}}</div><div class="name">{{name}}</div></div></div>'
}

var JenkinsWidget = {
	getRestUrl : function(){
		return this.url + "/lastCompletedBuild/testReport/api/json?jsonp=?";
	},
	parseData : function(json){
		this.data = {
			failed_tests : json.failCount,
			total_tests : json.totalCount || json.passCount,
			status : (json.failCount == 0) ? "success" : "fail"
		};
	}
};
$.extend(JenkinsWidget, BuildWidget);

var BambooWidget = {
	getRestUrl : function(){
		return this.url.replace(/\/browse\//,"\/rest\/api\/latest\/result\/") + "-latest.json?jsonp-callback=?";
	},
	parseData : function(json){
		this.data = {
			failed_tests : json.failedTestCount,
			total_tests : json.successfulTestCount + json.failedTestCount,
			status : (json.failedTestCount == 0) ? "success" : "fail"
		};
	}
};
$.extend(BambooWidget, BuildWidget);

var SonarWidget = {
	getRestUrl : function(){
		//api/resources?&metrics=coverage&callback=?&format=json&resource=
		//dashboard/index
		return this.url.replace(/dashboard\/index\//,"api\/resources?&metrics=coverage&callback=?&format=json&resource=");

		//return 'http://nemo.sonarsource.org/dashboard/index/436560';
	},
	parseData : function(json){
		var coverage = parseFloat(json[0].msr[0].val);

		this.data = {
			name : this.name,
			hue : coverage * 1.2 - 60,
			coverage_percentage : coverage + "%"
		}
	},
	template : '<div class="build" id="{{viewId}}" style="color:hsl({{data.hue}}, 72%, 43%);"><div class="indicator" style="background-color:hsl({{data.hue}}, 72%, 43%);"></div><div class="info"><div class="tests">{{data.coverage_percentage}}</div><div class="name">{{name}}</div></div></div>'
};

SonarWidget = $.extend({}, BuildWidget, SonarWidget);

var IFrameWidget = {
	initialize : function(){
		this.viewId = DashApp.generateId();
		this.schedule();
	},
	refresh : function(){
		var renderedView = Mustache.render(this.template, this);
		
		//todo, not sure why this isn't working on the first call
		$("#" + this.viewId).replaceWith(renderedView);
	},
	refreshRate : 10000,
	getInitialView : function(){
		return '<div id="' + this.viewId + '" class="loading">Loading</div>';
	},
	schedule : function(){
		var widget = this;
		widget.refresh();
		setInterval(function(){
			widget.refresh();
		}, widget.refreshRate);
	},
	template : '<div class="iframe" id="{{viewId}}"><iframe src="{{url}}" width="300" height="300"></iframe></div>'
};

var GroupWidget = {
	name : null,
	widgets : [],
	initialize : function(){
		this.viewId = DashApp.generateId();
		this.viewElement = $(this.render());
		for(var i = 0; i < this.widgets.length; i++){
			var widget = this.widgets[i];
			
			DashApp.extendByType(widget);
			
			this.widgets[i].initialize();

			this.viewElement.append(widget.getInitialView());
			
			widget.schedule();
		}		
	},
	render : function(){
		return Mustache.render(this.template, this);
	},
	getInitialView : function(){
		return this.viewElement;
	},
	template : '<div class="group" id={{viewId}}><div class="name">{{name}}</div></div>'
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
				var widget = page.widgets[j];

				DashApp.extendByType(widget);

				widget.initialize();
				
				// todo this should be something like page.addWidget
				$("#" + page.viewId).append(widget.getInitialView());
			}
		}
	},

	// refactor: add this method to page object?
	setupPageView : function(page, index){
		page.viewId = "page_" + index;
		var renderedPageView = Mustache.render(DashApp.pageTemplate, page);
		$("#" + DashApp.viewId).append(renderedPageView);
	},

	generateId : function(){
		return Math.floor(Math.random() * 1000000);
	},

	// Utility function to extend widgets
	extendByType : function(widget){
		eval("var type = " + widget.type);
		var tempWidget = $.extend({}, type, widget);
		$.extend(widget, tempWidget);
	}
};


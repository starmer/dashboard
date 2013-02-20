var exampleConfig = {
	viewId : "content",
	pageCycleTime : 3000,
	pages : [
		{
			name : "Page 1",
			widgets : [
				{
					type : "JenkinsWidget",
					name : "Jenkins Build 1",
					refreshRate : 100,
					url : "http://JENKINS-URL"
				},
				{
					type : "IFrameWidget",
					name : "External Content 1",
				},
				{
					type : "GroupWidget",
					name : "Group Widget 1",
					widgets : [
						{
							type : "JenkinsWidget",
							name : "Jenkins Build 1",
							refreshRate : 100,
							url : "http://JENKINS-URL"
						},
						{
							type : "JenkinsWidget",
							name : "Jenkins Build 2",
							refreshRate : 100,
							url : "http://JENKINS-URL"
						}
					]
				}
			]
		},
		{
			name : "Page 2",
			widgets : []
		},
		{
			name : "Page 3",
			widgets : []
		}
	]
};

/* view testing weirdness */
var setupViewContainer = function(){
	$('body').append('<div id="' + exampleConfig.viewId + '"></div>');
}

var cleanUpViewContainer = function(){
	$('#' + exampleConfig.viewId).remove();
}

describe("The dashboard application", function() {

	// Custom matchers
	beforeEach(function() {

		// check if a element on the dom is present with the given id
	  this.addMatchers({
	    toBeIdOnDom: function() {
	      return $('#' + this.actual).length == 1;
	    }
	  });

	  this.addMatchers({
	    toBeIdOnDomAndVisible: function() {
	      return $('#' + this.actual).is(":visible");
	    }
	  });
	});

	beforeEach(function() {
		jasmine.Clock.useMock();
		setupViewContainer();
		DashApp.initialize(exampleConfig);
	});

	afterEach(function(){
		cleanUpViewContainer();
	});

	it("should be ininitalizable", function() {
		expect(DashApp.pages.length).toBeGreaterThan(0);
		expect(DashApp.viewId).toEqual("content");
	});

	it("should cycle through pages showing one at a time", function(){
		// jasmine time mock wasn't working correctly for this it would trigger the interval twice
	});

	it("should provide a way to extend widgets", function(){
		expect(DashApp.extendByType).toBeDefined();
		var widget = {
					type : "JenkinsWidget",
					name : "Jenkins Build 1",
					refreshRate : 100,
					url : "http://JENKINS-URL"
		};

		DashApp.extendByType(widget);

		expect(widget.template).toBeDefined();

	});

	describe("Pages of the dashboard", function() {
		it("should have a name", function(){
			expect(DashApp.pages[0].name).toEqual("Page 1");
		});

		it("should render with a template", function(){
			expect($('body').html().indexOf('Page 1')).toBeGreaterThan(0);
			expect($('body').html().indexOf('Page 2')).toBeGreaterThan(0);
		});

		it("should have widgets", function() {
			expect(DashApp.pages[0].widgets.length).toBeGreaterThan(0);
		});

		it("should have a viewId", function(){
			expect(DashApp.pages[0].viewId).not.toEqual(DashApp.pages[1].viewId);
		});

		it("should have a dom element", function(){
			var viewId = DashApp.pages[0].viewId;
			expect(viewId).toBeIdOnDom();
		});

		// more view testing weirdness
		it("should create placeholders for it's widgets", function(){
			var jenkinsWidget = DashApp.pages[0].widgets[0];
			var iframeWidget = DashApp.pages[0].widgets[1];
			expect(jenkinsWidget.viewId).toBeIdOnDom();
			expect(jenkinsWidget.viewId).toBeIdOnDom();
		});
	});

	describe("Widgets", function(){
		it("should initialize based on type", function(){

			var jenkinsWidget = DashApp.pages[0].widgets[0];
			
			expect(jenkinsWidget.refresh).toBeDefined();
			expect(jenkinsWidget.refreshRate).toBeDefined();
			expect(jenkinsWidget.template).toBeDefined();
			expect(jenkinsWidget.url).toEqual("http://JENKINS-URL");

			jenkinsWidget.refresh = jasmine.createSpy('refresh');
			jasmine.Clock.tick(101);
			expect(jenkinsWidget.refresh).toHaveBeenCalled();
		});

		it("should have a unique viewId", function(){
			var jenkinsWidget = DashApp.pages[0].widgets[0];
			var iframeWidget = DashApp.pages[0].widgets[1];

			expect(jenkinsWidget.viewId).toBeDefined();
			expect(jenkinsWidget.viewId).not.toEqual(iframeWidget.viewId);
		});

		it("should have a data", function(){
			var jenkinsWidget = DashApp.pages[0].widgets[0];
			var iframeWidget = DashApp.pages[0].widgets[1];

			expect(jenkinsWidget.name).toEqual("Jenkins Build 1");
			expect(iframeWidget.name).toEqual("External Content 1");
		});

	});

	describe("GroupWidget instance", function(){
		it("should have widgets", function(){
			var groupWidget = DashApp.pages[0].widgets[2];
			expect(groupWidget.widgets.length).toBeGreaterThan(0);
		});

		it("should render the default template", function(){
			var groupWidget = DashApp.pages[0].widgets[2];
			expect(groupWidget.viewId).toBeIdOnDom();
			expect($('#' + groupWidget.viewId).html().indexOf(groupWidget.name)).toBeGreaterThan(-1);
			expect(groupWidget.widgets[0].viewId).toBeIdOnDom();
		});

		xit("should delegate widget setup", function(){
			var groupWidget = DashApp.pages[0].widgets[2];
			expect(groupWidget.viewId).toBeDefined();
			expect(groupWidget.widgets[0].viewId).toBeDefined();
		});

		xit("should delegate scheduling", function(){
			var groupWidget = DashApp.pages[0].widgets[2];

			console.log(groupWidget);
			groupWidget.widgets[0].schedule();

			spyOn(groupWidget.widgets[0],'schedule');
			groupWidget.schedule();
			expect(groupWidget.widgets[0].schedule).toHaveBeenCalled();
		});
	});
});

describe("JenkinsWidget", function(){
	beforeEach(function() {
		jasmine.Clock.useMock();
	});

	it("should create the correct rest jsonp url for jenkins", function(){
		var widget = $.extend(JenkinsWidget,{url:"http://jenkins.com:9080/job/PROJECT-NAME"});
		expect(widget.getRestUrl()).toEqual("http://jenkins.com:9080/job/PROJECT-NAME/lastCompletedBuild/testReport/api/json?jsonp=?");
	});

	it("should parse the jenkins data into a build data object", function(){
		var response = {"failCount":3,"skipCount":0,"totalCount":199,"urlName":"testReport","childReports":null};

		// use a spy so we don't use a live ajax request
		spyOn($, "ajax").andCallFake(function(options) {
			options.success(response);
		});

		var widget = $.extend({}, JenkinsWidget, {url:"http://jenkins.com:9080/job/PROJECT-NAME", refreshRate:100});
		widget.refresh();

		expect(widget.data.failed_tests).toEqual(3);
		expect(widget.data.total_tests).toEqual(199);
		expect(widget.data.status).toEqual("fail");
	});

	it("should initialize", function(){
		var widget = $.extend(JenkinsWidget, {url:"http://jenkins.com:9080/job/PROJECT-NAME"});
		widget.initialize();
		expect(widget.viewId).toBeGreaterThan(0);
	});

	it("should have an initial view", function(){
		expect(JenkinsWidget.getInitialView()).toBeDefined();
		expect(JenkinsWidget.getInitialView().indexOf("Loading")).toBeGreaterThan(-1);
	});
});

describe("GroupWidget", function(){
	it("should have multpile widgets", function(){
		var widget = $.extend({},GroupWidget,{name:'Group Widget 1'});
		expect(widget).toBeDefined();
		expect(widget.widgets).toBeDefined();
		expect(widget.name).toEqual('Group Widget 1');
	});
});
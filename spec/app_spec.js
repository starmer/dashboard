var exampleConfig = {
	viewId : "content",
	pageCycleTime : 3000,
	pages : [
		{
			name : "Page 1",
			widgets : [
				{
					type : "JenkinsWidget",
					options : {
						refreshRate : 102
					}
				},
				{
					type : "IFrameWidget",
					options : {
						
					}
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
		DashApp.cleanUp();
		cleanUpViewContainer();
	});

	it("should be ininitalizable", function() {
		expect(DashApp.pages.length).toBeGreaterThan(0);
		expect(DashApp.viewId).toEqual("content");
	});

	it("should cycle through pages showing one at a time", function(){
		// jasmine time mock wasn't working correctly for this it would trigger the interval twice
	});

	describe("Pages of the dashboard", function() {
		it("should have a name", function(){
			expect(DashApp.pages[0].name).toEqual("Page 1");
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
			expect(DashApp.intervals.length).toEqual(2);

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
	});


});
var exampleConfig = {
	viewId : "content",
	pages : [
		{
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
		}
	]
};

/* view testing weirdness */
var setupViewContainer = function(){
	$('body').append('<div id="' + exampleConfig.viewId + '" style="display:none"></div>');
}

var cleanUpViewContainer = function(){
	$('#' + exampleConfig.viewId).remove();
}

describe("The dashboard application", function() {
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

	describe("Pages of the dashboard", function() {
		it("should have widgets", function() {
			expect(DashApp.pages[0].widgets.length).toBeGreaterThan(0);
		});

		// more view testing weirdness
		it("should create placeholders for it's widgets", function(){
			expect($("#"))
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
$(function(){
var config = {
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

DashApp.initialize(config);
});
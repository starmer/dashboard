$(function(){
var config = {
	viewId : "content",
	pageCycleTime : 3000,
	
	pages : [
		{
			name : "Page 1",
			widgets : [
				{
					name : "Jenkins Build 1",
					type : "JenkinsWidget",
					refreshRate : 10000,
					url : "https://builds.apache.org/job/DeltaSpike%20Weld%201.1.10/"
				},
				{
					type : "IFrameWidget"
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
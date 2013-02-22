$(function(){
var config = {
	viewId : "content",
	pageCycleTime : 90000,
	// 
	pages : [
		{
			name : "Page 1",
			widgets : [
				{
					name : "Group 1",
					type : "GroupWidget",
					widgets : [
						{
							name : "Jenkins Build 2",
							type : "JenkinsWidget",
							refreshRate : 3000,
							url : "https://partnerdemo.ci.cloudbees.com/job/stockfishchess-ios-ipad-touchtest"
						},
						{
							name : "Bamboo Build 1",
							type : "BambooWidget",
							refreshRate : 30000,
							url : "https://bamboo-ci.codehaus.org/browse/JETTY-ECLIPSETRUNK8"
						},
						{
							name : "Sonar Project 1",
							type : "SonarWidget",
							refreshRate : 30000,
							url : "http://nemo.sonarsource.org/dashboard/index/436560"
						}
					]
				},
				{
					name : "Group 1",
					type : "GroupWidget",
					widgets : [
						{
							name : "Jenkins Build 2",
							type : "JenkinsWidget",
							refreshRate : 3000,
							url : "https://partnerdemo.ci.cloudbees.com/job/stockfishchess-ios-ipad-touchtest"
						},
						{
							name : "Bamboo Build 1",
							type : "BambooWidget",
							refreshRate : 30000,
							url : "https://bamboo-ci.codehaus.org/browse/JETTY-ECLIPSETRUNK8"
						},
						{
							name : "Sonar Project 1",
							type : "SonarWidget",
							refreshRate : 30000,
							url : "http://nemo.sonarsource.org/dashboard/index/436560"
						}
					]
				},
				{
					name : "Jenkins Build 1",
					type : "JenkinsWidget",
					refreshRate : 30000,
					url : "https://partnerdemo.ci.cloudbees.com/job/mongo-chess-cobertura"
				},
				{
					name : "Sonar Project 1",
					type : "SonarWidget",
					refreshRate : 30000,
					url : "http://nemo.sonarsource.org/dashboard/index/436560"
				}
			]
		},
		{
			name : "Page 2",
			widgets : [
				{
					type : "IFrameWidget",
					url : "http://jamesstarmer.com/blog",
					refreshRate : 300000
				}
			]
		}
	]
};

DashApp.initialize(config);
});
$(function(){

	dashboard.initialize({
		groups : [
			{
				name : "Team 1 Builds",
				builds:[
					{
						name : "Project Name 1",
						url : "https://builds.apache.org/job/DeltaSpike%20Weld%201.1.10/",
						type : dashboard.build_types.jenkins
					},
					{
						name : "Project Name 2",
						url : "http://bamboo.internal.opennms.com:8085/browse/OPENNMS-JUNITSPEEDUP",
						type : dashboard.build_types.bamboo
					}
				]
			},{
				name : "Team 2 Builds",
				builds:[
				]
			}
		]
	});


	var output = Mustache.render(dashboard.templates.groups, dashboard);
	$("#content").html(output);

});
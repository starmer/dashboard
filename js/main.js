dashboard = {
	initialize : function(opts){
		this.groups = opts.groups;
		_.each(this.groups, function(group){
			_.each(group.builds, function(build){
				$.extend(build, dashboard.models.build);
			});
		});
	},

	models : {
		build : {
			refresh : function() {
				var this_build = this;
				$.ajax({
					url:this.get_rest_url(),
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					success: function(json) {
						this_build.handle_response_data(json);
					},
					error: function(e) {
						console.log(e.message);
					}
				});
			},
			get_rest_url : function() {
				return this.type.get_rest_url(this.url);
			},
			handle_response_data : function(response) {
				this.data = this.type.parse_raw_response(response);
			}
		}
	},

	build_types : {
		jenkins : {
			get_rest_url : function(url) {
				return url + "/lastBuild/testReport/api/json?jsonp=?";
			},
			parse_raw_response : function(response){
				return {
					failed_tests : response.failCount,
					total_tests : response.totalCount
				};
			}
		},
		bamboo : {
			get_rest_url : function(url) {
				return url.replace(/\/browse\//,"\/rest\/api\/latest\/result\/") + "-latest.json?jsonp-callback=?"
			},
			parse_raw_response : function(response){
				return {
						failed_tests : response.failedTestCount,
						total_tests : response.successfulTestCount + response.failedTestCount
				};
			}
		}
	}
};

$(function(){
/*	
	dashboard.initialize({
		groups : [
			{
				name : "Team 1 Builds",
				builds:[
					{
						url : "http://jenkins.com:9080/job/PROJECT-NAME",
						type : dashboard.build_types.jenkins
					},
					{
						url : "http://bamboo.com:8085/browse/PROJECT-NAME",
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
*/
});

/*
$(function(){
	var bamboo = "http://bamboo.internal.opennms.com:8085/rest/api/latest/result/OPENNMS-JUNITSPEEDUP-latest.json?jsonp-callback=?";
	var jenkins = "http://builds.apache.org/job/DeltaSpike%20Weld%201.1.10/lastBuild/testReport/api/json?jsonp=?";
	
	$.ajax({
		url:jenkins,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
       console.dir(json);
    },
    error: function(e) {
       console.log(e.message);
    }
	});
	
	$.ajax({
		url:bamboo,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
       console.dir(json);
    },
    error: function(e) {
       console.log(e.message);
    }
	});
});
*/
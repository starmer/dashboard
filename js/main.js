dashboard = {
	initialize : function(opts){
		var groups = opts.groups;
		//this.groups = _.extend(opts.groups, this.groups);
		this.groups = opts.groups;
		//_.extend(this, opts);
		_.each(groups, function(group){
			var builds = group.builds;

			_.each(group.builds, function(build){
				console.log(build);
				var i = _.indexOf(builds, build);
				new_build = _.extend(build, dashboard.build_proto);
				console.log(new_build.refresh)
				builds[i] = new_build;
			});
		});
	},

	build_proto : {
		refresh : function() {

		}
	}

};


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



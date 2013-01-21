dashboard = {
	initialize : function(opts){
		this.groups = opts.groups;
		_.each(this.groups, function(group){
			_.each(group.builds, function(build){
				$.extend(build, dashboard.models.build);
			});
		});
	},

	refresh : function(){
		_.each(dashboard.groups, function(group){
			_.each(group.builds, function(build){
				try {
					build.refresh();
				} catch (e) {
					console.log(e);
				}

				dashboard.render();
			});
		});
	},

	render : function() {
		var output = Mustache.render(this.templates.groups, this);
		$("#content").html(output);
	},

	models : {
		build : {
			refresh : function() {
				var this_build = this;
				$.ajax({
					url:this.get_rest_url(),
					jsonpCallback: 'jsonCallback' + Math.floor(Math.random()*1000000000),
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
					total_tests : response.totalCount,
					status : (response.failCount == 0) ? "success" : "fail"
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
						total_tests : response.successfulTestCount + response.failedTestCount,
						status : (response.failedTestCount == 0) ? "success" : "fail"
				};
			}
		}
	},
	templates : {
		groups : 
		"{{#groups}}" + 
		"				<div class=\"group\">" +
		"					<div class=\"group_name\">{{name}}</div>" +
		"					<div>" +
		"{{#builds}}" +
		"						<table class=\"builds\">" +
		"							<tr class=\"{{data.status}}\">" +
		"								<td>" +
		"									<div class=\"bar\">" +
		"									</div>" +
		"								</td>" +
		"								<td class=\"info\">" +
		"									{{data.failed_tests}} / {{data.total_tests}}" +
		"									<div class=\"build_name\">" +
		"										{{name}}" +
		"									</div>" +
		"								</td>" +
		"							</tr>" +
		"{{/builds}}" +
		"						</table>" +
		"					</div>" +
		"				</div>" +
		"{{/groups}}"
	}
};
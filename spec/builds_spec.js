//https://bamboo-ci.codehaus.org/rest/api/latest/result/ANDROMDA-ANDROMDAALL.json
//{"results":{"size":5,"expand":"result","start-index":0,"max-result":5,"result":[{"expand":null,"link":{"href":"https://bamboo-ci.codehaus.org/rest/api/latest/result/ANDROMDA-ANDROMDAALL-68","type":null,"rel":"self"}
var initialize_dashboard = function(){
			dashboard.initialize({
			groups : [
				{
					builds:[
						{
							url : "http://a"
						},
						{
							url : "http://b"
						}
					]
				},{
					builds:[
					]
				}
			]
		});
}

describe("the application", function(){
	it("should have a namespace", function(){
		expect(dashboard).toBeDefined();
	});

	it("should be initializable", function(){
		initialize_dashboard();
		expect(dashboard.groups.length).toEqual(2);
		expect(dashboard.groups[0].builds[0].url).toEqual("http://a");
		expect(_.isFunction(dashboard.groups[0].builds[0].refresh)).toEqual(true);
	});
});

/*
describe("groups", function(){
	it("should have builds", function(){
		expect(dashboard.groups.builds.length).toBeGreaterThan(0);
		expect(dashboard.groups.builds[0].url).not.toBeUndefined();
		expect(dashboard.groups.builds[0].type).toEqual("jenkins");
		expect(dashboard.groups.builds[0].type).toEqual("jenkins");
	});
});

describe("builds", function(){
	it("should have data", function(){
		dashboard.groups[0].builds[0].data
	});
});

*/
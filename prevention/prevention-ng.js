// vim: set ts=2 sw=2 et:

angular.module('PHD-Prev', ['schemaForm'])
       .controller('PreventionFormController', function($scope) {

  $scope.schema = {
    type: "object",
    properties: {
      birth_year: { type: "integer", title: "Birth year" },
      birth_month: {
        type: "string",
		title: "Birth month",
        enum: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      },
      birth_gender: {
        type: "string",
        title: "Birth gender",
        enum: ['Female','Male'],
      },

      atsi: { title: "Aboriginal or Torres Strait Islander", enum: ['unsure','yes','no'], type: "string", },
      diabetes: { title: "Diabetes", enum: ['unsure','yes','at risk', 'no'], type: "string", },
      overweight: { title: "Overweight", enum: ['unsure','yes','no'], type: "string", },
      cvd: { title: "Cardiovascular disease", enum: ['unsure','yes','no'], type: "string", },
      cvdfh: { title: "Cardiovascular disease family history", enum: ['unsure','yes','no'], type: "string", },
      stroke: { title: "Stroke", enum: ['unsure','yes','no'], type: "string", },
      gout: { title: "Gout", enum: ['unsure','yes','no'], type: "string", },
      liver: { title: "Liver disease", enum: ['unsure','yes','no'], type: "string", },

      metabolism_last_checked: { type: "string", format: "date", title: "Last weight/nutrition/activity checkup", },
      skin_last_checked: { type: "string", format: "date", title: "Last checked", },
      papsmear_last_checked: { type: "string", format: "date", title: "Last done", },
      sti_last_checked: { type: "string", format: "date", title: "Last done", },

	  skin_risk: {
	    type: "string",
		title: "Risk",
		description: "<a target='blank' href='http://www.racgp.org.au/your-practice/guidelines/redbook/early-detection-of-cancers/skin-cancer'>See guidelines</a>",
		default: "unsure",
		enum: [
				"unsure",
				"average - opportunistic",
				"increased - opportunistic",
				 "high - yearly",
		],
	  },

	  sti_risk: {
	    type: "string",
		title: "Risk",
		description: "<a target='blank' href='http://www.racgp.org.au/your-practice/guidelines/redbook/communicable-diseases/sexually-transmissible-infections/'>See guidelines</a>",
		default: "unsure",
		enum: [
				"unsure",
				"average",
				"medium-high",
				"higher",
				"highest",
		],
	  },
	},
  };

  $scope.form = [
    "birth_year", "birth_month", "birth_gender",
	"atsi", "diabetes", "overweight", "cvd", "stroke", "gout", "liver",
	"metabolism_last_checked",
	{
		type: "fieldset",
		title: "STI checks",
		items: [
			"sti_risk",
			"sti_last_checked",
		],
	},
	{
		type: "fieldset",
		title: "Skin checks",
		items: [
			"skin_risk",
			"skin_last_checked",
		],
	},
	{
		type: "fieldset",
		title: "Pap smear",
		condition: "model.birth_gender == 'Female'",
		items: [
			"papsmear_last_checked",
		],
	},
	{
		key: "reminders",
		title: "Reminders",
		add: "New",
		style: { "add" : "btn-success" },
		items: [
			"reminders[].risk",
			"reminders[].description",
			"reminders[].custom_num",
			"reminders[].custom_type",
			"reminders[].last_checked",
		],
	},
    {
      type: "submit",
      title: "Save"
    }
  ];

  $scope.without_form = {

  };

  $scope.model = {};
  var modelJson = localStorage["prevention_answers"];
  if (modelJson) {
    $scope.model = JSON.parse(modelJson);
    console.log("loaded saved recommendations", $scope.model);
  }

  $scope.guidelines = [
    /* based on the RACGP Red Book 9th edition */

     { title: "Weight check",
       guide: [
         { freq: '2y', },
         { freq: '1y', if_any: ['atsi', 'diabetes', 'cvd', 'stroke', 'gout', 'liver'] },
         { freq: '6m', if_any: ['overweight'] },
       ],
     },
     { title: "Nutrition",
       guide: [
         { freq: '2y', },
         { freq: '6m', if_any: ['overweight', 'diabetes', 'cvdfh'] },
       ],
     },
      


  ];

  $scope.updateRecs = function() {

     var recs = [];

     /* overweight */
     if ($scope.model.atsi == 'yes' || 
         $scope.model.diabetes == 'yes' || 
         $scope.model.cvd == 'yes' || 
         $scope.model.stroke == 'yes' || 
         $scope.model.gout == 'yes' || 
         $scope.model.liver == 'yes')
     {
        var rec = { title: 'Weight check', 

     }

  };
 
  $scope.onSave = function(form) {
		$scope.$broadcast('schemaFormValidate');
		console.log("onSubmit");

		if (form.$valid) {
			console.log($scope.model);
      
      var json = JSON.stringify($scope.model);
      localStorage["prevention_answers"] = json;

		}

  };

});

$(document).on("click", "a", function() {

   var link = this;
   var href = $(link).attr("href");

	var existingIframes = $("iframe").filter(  function (index, elt) {
	   console.log( $(elt).attr("src"));
	   return $(elt).attr("src") == link;
	 });

	if (existingIframes.length == 0) {

		var iframe = $("<iframe></iframe>");
		iframe.attr("src", href);
		iframe.addClass("redbook-iframe");
		iframe.insertAfter(link);

	} else {
		existingIframes.remove();
	}


   return false;

});

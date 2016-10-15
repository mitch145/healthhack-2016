"use strict";
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
      cvdrisk: {
        title: "Cardiovascular disease risk", enum: ['unsure','low (<10%)','moderate (10-15%)', 'high (>15%)'], type: "string",
        description: "<a target='blank' href='http://www.racgp.org.au/your-practice/guidelines/redbook/prevention-of-vascular-and-metabolic-disease/blood-pressure/'>See guidelines</a>",
      },
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
	"atsi", "diabetes", "overweight", "cvd", "cvdrisk", "stroke", "gout", "liver",
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

  $scope.model = {};
  var modelJson = localStorage["prevention_answers"];
  if (modelJson) {
    $scope.model = JSON.parse(modelJson);
    console.log("loaded saved recommendations", $scope.model);
  }

  $scope.guidelines = [
    /* based on the RACGP Red Book 9th edition */
     { title: "Weight check",
       last_check: "metabolism_last_checked",
       options: [
         { freq: 1, units: 'years', if_any: ['atsi', 'diabetes', 'cvd', 'stroke', 'gout', 'liver'] },
         { freq: 2, units: 'years', },
         { freq: 6, units: 'months', if_any: ['overweight'] },
       ],
     },
     { title: "Nutrition review",
       last_check: "metabolism_last_checked",
       options: [
         { freq: 2, units: 'years', },
         { freq: 6, units: 'months', if_any: ['overweight', 'diabetes', 'cvdfh'] },
       ],
     },
     { title: "Blood pressure",
       last_check: "metabolism_last_checked",
       options: [
         { freq: 2, units: 'years', },
         { freq: 12, units: 'months', if_risk: { cvdrisk: 'moderate (10-15%)'} },
         { freq: 6, units: 'months', if_any: ['cvd'] },
         { freq: 3, units: 'months', if_risk: { cvdrisk: 'high (>15%)'} },
       ],
     },
     { title: "STI check",
       last_check: "sti_last_checked",
       options: [
         { freq: 1, units: 'years', if_risk: { sti_risk: 'higher'} },
         { freq: 6, units: 'months', if_risk: { sti_risk: 'highest'} },
       ],
     },
  ];
  $scope.guidelines.forEach(function(guideline) {
    guideline.options.forEach(function(option) {
        option.duration = moment.duration(option.freq, option.units);
        option.duration_ms = option.duration.asMilliseconds();
    });

    guideline.options.sort(function(a,b) {
      return a.duration_ms - b.duration_ms;
      /* ascending order - shortest duration first */
    });
  });

  var prev_recs = "";
  
var idempotentialize = function(f){
    var previous;
    var f_idempotent = function(model){
       var ret = f(model);
       if (angular.toJson(ret)==angular.toJson(previous))
          ret = previous;
       previous = ret;
       return ret;
    }
    return f_idempotent;
};
  $scope.getRecommendations = idempotentialize(function(model) {

     var checkYes = function(key) {
        return model[key] === "yes";
     };

     var recs = $scope.guidelines.map(function(guideline) {
     
        var matching = guideline.options.filter(function(option) {
           if (option.if_any) {
              return option.if_any.some(checkYes);
           } else if (option.if_risk) {
              var key = Object.keys(option.if_risk)[0];
              var val = option.if_risk[key];
              return model[key] === val;
           } else {
              return true;
           }
        });

        if (matching.length == 0) {
          return null;
        }


        var from_date = moment();
        var last_checked = model[guideline.last_check];
        if (last_checked) {
           from_date = moment(last_checked);
        }

        var next_checkup = from_date.clone().add(matching[0].duration);
        next_checkup.second(0);
        next_checkup.millisecond(0);

        return {
          title: guideline.title,
          interval_txt: matching[0].duration.humanize(),
          interval_months: matching[0].duration.asMonths(),
          prev_checkup_txt: last_checked ? from_date.format("D MMM YYYY") : "",
          next_checkup_mmyy: next_checkup.format("MMMM YYYY"),
          next_checkup: next_checkup,
        };
     });
     recs = recs.filter(function(rec) { return rec != null; });
     recs.sort(function(a,b) {
        return a.next_checkup.valueOf() - b.next_checkup.valueOf();
     });

     console.log("recs", recs);

     return recs;

  });



 
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

/**
 * traindemo.js: Quick demo of mouseovers and seat selection for train project
 * Author: NiJeL
 */


$(document).ready(function () {

	// get width 
	var w = $('.col-md-12').width();
 
 	// bind image
 	var image = $('#chi_redline_subway_A_car');

	image.mapster({
        fillColor: 'f08b9d',
        fillOpacity: 0.5,
        singleSelect: true,
		mapKey: 'data-key',
		render_select: {
            altImage: '/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
            fillOpacity: 1
        },
        areas:[ 
	        {
	          key: '48',
	          staticState: false
	      	},
	        {
	          key: '47',
	          staticState: false
	      	},
	        {
	          key: '46',
	          staticState: false
	      	},
	        {
	          key: '45',
	          staticState: false
	      	},
	        {
	          key: '17',
	          staticState: false
	      	},
	        {
	          key: '18',
	          staticState: false
	      	},
	        {
	          key: '41',
	          staticState: false
	      	},
	        {
	          key: '42',
	          staticState: false
	      	},
	        {
	          key: '43',
	          staticState: false
	      	},
	        {
	          key: '44',
	          staticState: false
	      	},
	        {
	          key: '40',
	          staticState: false
	      	},
	        {
	          key: '39',
	          staticState: false
	      	},
	        {
	          key: '38',
	          staticState: false
	      	},
	        {
	          key: '26',
	          staticState: false
	      	},
	        {
	          key: '27',
	          staticState: false
	      	},
	        {
	          key: '28',
	          staticState: false
	      	},
	        {
	          key: '29',
	          staticState: false
	      	},
	        {
	          key: '25',
	          staticState: false
	      	},
	        {
	          key: '52',
	          staticState: false
	      	},
	        {
	          key: '51',
	          staticState: false
	      	},
	        {
	          key: '50',
	          staticState: false
	      	},
	        {
	          key: '49',
	          staticState: false
	      	},
	        {
	          key: '16',
	          staticState: false
	      	},
	        {
	          key: '15',
	          staticState: false
	      	},
	        {
	          key: '31',
	          staticState: false
	      	},
	        {
	          key: '32',
	          staticState: false
	      	},
	        {
	          key: '33',
	          staticState: false
	      	},
	        {
	          key: '34',
	          staticState: false
	      	},
	        {
	          key: '35',
	          staticState: false
	      	},
	        {
	          key: '36',
	          staticState: false
	      	},
	        {
	          key: '37',
	          staticState: false
	      	},
	        {
	          key: '23',
	          staticState: false
	      	},
	        {
	          key: '20',
	          staticState: false
	      	},
	        {
	          key: '21',
	          staticState: false
	      	},
	        {
	          key: '22',
	          staticState: false
	      	},
	        {
	          key: '19',
	          staticState: false
	      	},
	        {
	          key: '24',
	          staticState: false
	      	},
	     ]

	});

	// resize image
    image.mapster('resize', w, 0, 0);

    console.log(image.mapster('get_options'));


});

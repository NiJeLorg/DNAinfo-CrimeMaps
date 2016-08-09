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
            altImage: '/visualizations/static/crimemaps/css/images/chi_redline_subway_A_car_where_you_sit.png',
            fillOpacity: 1
        },
        areas:[ 
	        {
	          key: '48',
	          isSelectable: false
	      	},
	        {
	          key: '47',
	          isSelectable: false
	      	},
	        {
	          key: '46',
	          isSelectable: false
	      	},
	        {
	          key: '45',
	          isSelectable: false
	      	},
	        {
	          key: '17',
	          isSelectable: false
	      	},
	        {
	          key: '18',
	          isSelectable: false
	      	},
	        {
	          key: '41',
	          isSelectable: false
	      	},
	        {
	          key: '42',
	          isSelectable: false
	      	},
	        {
	          key: '43',
	          isSelectable: false
	      	},
	        {
	          key: '44',
	          isSelectable: false
	      	},
	        {
	          key: '40',
	          isSelectable: false
	      	},
	        {
	          key: '39',
	          isSelectable: false
	      	},
	        {
	          key: '38',
	          isSelectable: false
	      	},
	        {
	          key: '26',
	          isSelectable: false
	      	},
	        {
	          key: '27',
	          isSelectable: false
	      	},
	        {
	          key: '28',
	          isSelectable: false
	      	},
	        {
	          key: '29',
	          isSelectable: false
	      	},
	        {
	          key: '25',
	          isSelectable: false
	      	},
	        {
	          key: '52',
	          isSelectable: false
	      	},
	        {
	          key: '51',
	          isSelectable: false
	      	},
	        {
	          key: '50',
	          isSelectable: false
	      	},
	        {
	          key: '49',
	          isSelectable: false
	      	},
	        {
	          key: '16',
	          isSelectable: false
	      	},
	        {
	          key: '15',
	          isSelectable: false
	      	},
	        {
	          key: '31',
	          isSelectable: false
	      	},
	        {
	          key: '32',
	          isSelectable: false
	      	},
	        {
	          key: '33',
	          isSelectable: false
	      	},
	        {
	          key: '34',
	          isSelectable: false
	      	},
	        {
	          key: '35',
	          isSelectable: false
	      	},
	        {
	          key: '36',
	          isSelectable: false
	      	},
	        {
	          key: '37',
	          isSelectable: false
	      	},
	        {
	          key: '23',
	          isSelectable: false
	      	},
	        {
	          key: '20',
	          isSelectable: false
	      	},
	        {
	          key: '21',
	          isSelectable: false
	      	},
	        {
	          key: '22',
	          isSelectable: false
	      	},
	        {
	          key: '19',
	          isSelectable: false
	      	},
	        {
	          key: '24',
	          isSelectable: false
	      	},
	     ]

	});

	// resize image
    image.mapster('resize', w, 0, 0);

    console.log(image.mapster('get_options'));


});

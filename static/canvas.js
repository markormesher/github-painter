var activeBrush = 'darkest';

function prepareCanvas() {
	var canvas = $('#canvas');
	for (var col = 0; col < 52; ++col) {
		var colDiv = $('<div class="column" />')
		for (var row = 0; row < 7; ++row) {
			colDiv.append('<div class="cell blank" id="cell-' + ((col * 7) + row) + '" />');
		}	
		canvas.append(colDiv);
	}
}

function initListeners() {
	$('.cell').click(function() {
		$(this).removeClass('dark').removeClass('darker').removeClass('darkest');
		$(this).addClass(activeBrush);
	});

	$('input[type=radio][name=brush]').change(function() {
		activeBrush = $(this).val();
	});

	$('#create-btn').click(function(e) {
		e.preventDefault();
		create();
	});
}

function create() {
	var values = [];
	for (var i = 0; i < (7 * 52); ++i) {
		var cell = $('#cell-' + i);
		if (cell.hasClass('dark')) {
			values.push(30);			
		} else if (cell.hasClass('darker')) {
			values.push(60);
		} else if (cell.hasClass('darkest')) {
			values.push(90);
		} else {
			values.push(0)
		}
	}

	$.post(
		'/create', 
		{
			name: $('#repoName').val(),
			values: values
		}
	).done(function() {
		alert('Done!');
	}).fail(function() {
		alert('Something didn\'t work there');
	});
}

$(document).ready(function() {
	prepareCanvas();
	initListeners();
});

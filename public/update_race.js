function updateRace(id){
	$.ajax({
		url: '/races/' + id,
		type: 'PUT',
		data: $('#update_race').serialize(),
		success: function(result){
			window.location.replace('/races');
		}
	})
};
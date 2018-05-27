function deleteRace(id){
	$.ajax({
		url: '/races/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};
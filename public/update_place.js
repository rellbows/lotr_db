function updatePlace(id){
	$.ajax({
		url: '/places/' + id,
		type: 'PUT',
		data: $('#update_place').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};
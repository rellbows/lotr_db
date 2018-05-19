function deleteCharacter(id){
	$.ajax({
		url: '/characters/' + id,
		type: 'DELETE',
		success: function(results){
			window.location.reload(true);
		}
	})
};
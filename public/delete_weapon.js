function deleteWeapon(id){
	$.ajax({
		url: '/weapons/' + id,
		type: 'DELETE',
		success: function(results){
			window.location.reload(true);
		}
	})
};
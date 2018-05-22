function updateWeapon(id){
	$.ajax({
		url: '/weapons/' + id,
		type: 'PUT',
		data: $('#update_weapon').serialize(),
		success: function(result){
			window.location.replace('/weapons');
		}
	})
};
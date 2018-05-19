function updateCharacter(id){
	console.log('in updateCharacter')
	console.log($('#update_character').serialize())
    $.ajax({
        url: '/characters/' + id,
        type: 'PUT',
        data: $('#update_character').serialize(),
        success: function(result){
            window.location.replace("/characters");
        }
    })
};
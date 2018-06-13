function updateCharacter(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'PUT',
        data: $('#update_character').serialize(),
        success: function(result){
            window.location.replace("/characters");
        }
    })
};

function updateCharacterWithWeapon(character_id, weapon_id){
	$.ajax({
		url: '/characters_weapons/' + character_id + '/' + weapon_id,
		type: 'PUT',
		data: $('#update_character_weapon').serialize(),
		success: function(result){
			window.location.replace("/characters_weapons");
		}
	})
};
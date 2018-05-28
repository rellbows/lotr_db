function deleteCharacter(id){
	$.ajax({
		url: '/characters/' + id,
		type: 'DELETE',
		success: function(results){
			window.location.reload(true);
		}
	})
}

function deleteCharacterWithWeapon(character_id, weapon_id){
	$.ajax({
		url: '/characters_weapons/character_id/' + character_id + '/weapon_id/' + weapon_id,
		type: 'DELETE',
		success: function(results){
			window.location.reload(true);
		}
	})
}

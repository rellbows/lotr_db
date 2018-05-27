function deletePlace(id){
	$.ajax({
		url: '/places/' + id,
		type: 'DELETE',
		success: function(results){
			window.location.reload(true);
		}
	})
}

function deletePlaceLocatedIn(child_place_id, parent_place_id){
	$.ajax({
		url: '/places/child_place_id/' + child_place_id + '/parent_place_id/' + parent_place_id,
		type: 'DELETE',
		success: function(results){
			window.location.reload(true);
		}
	})
};
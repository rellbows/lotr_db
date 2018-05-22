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
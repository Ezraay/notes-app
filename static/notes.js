// Called whenever the "Save Note" button is clicked
$('#note-save').click(function() {
    const text = $('#note-text-input').val()
    if (!text) return

    $.post('/create', { text }, response => {
        if (response.status === 201)
            location.reload()
    })
})

// Called whenever any "Delete" button is clicked
$('.delete-note').click(function() {
    const parent = $($(this)[0].closest('.note')) // Gets the parent of this button
    const noteID = parent.attr('noteID')
    
    $.post('/delete', { noteID }, response => {
        if (response.status === 200)
            location.reload()
    })
})

// Called whenever a note is clicked to edit
$('.note-text').click(function () {
    const parent = $($(this)[0].closest('.note')) // Gets the parent of this button
    const noteID = parent.attr('noteID')

    const oldText = $(this).text()
    const text = prompt('Editing message.', oldText)

    if (!text || text === oldText) return

    $.post('/edit', { text, noteID }, response => {
        if (response.status === 200)
            location.reload()
    })
})
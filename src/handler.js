const {nanoid} = require('nanoid');
const notes = require('./notes');


//menambahkan note
const addNoteHandler = (request, h) => {

    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;


    
    const newNote = {
        title, 
        tags, 
        body, 
        id, 
        createdAt, 
        updatedAt,
      };
     
      notes.push(newNote);

   const isSuccess = notes.filter((note) => note.id === id).length > 0;
   
   if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;

};

//GET note data
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const note = notes.filter((n) => n.id == id)[0];

    if (note != undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Edit Note
const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();

    //dapatkan dulu index array pada objek catatan sesuai id yang ditentukan
    const index = notes.findIndex((note) => note.id == id);
    if (index != -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
        
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. ID tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdhandler = (request, h) => {
    const { id } = request.params;
    // dapatkan index dari objek catatan sesuai dengan id yang didapat
    const index = notes.findIndex((note) => note.id == id);

    if (index != -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Catatan tidak ditemukan', // tambahkan pesan yang sesuai
        });
        response.code(404);
        return response;
    }
};


module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdhandler};
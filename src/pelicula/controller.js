import { ObjectId } from "mongodb";
import client from "../common/dbconn.js";
import { Pelicula } from "./pelicula.js";

const peliculaCollection = client.db('cine-db').collection('peliculas');

async function handleInsertPelicula(req, res) {
    let data = req.body;
    let pelicula = Pelicula;
    pelicula.nombre = data.nombre;
    pelicula.generos = data.generos;
    pelicula.anioEstreno = data.anioEstreno;

    await peliculaCollection.insertOne(pelicula)
    .then((data) => {
        if(data === null) return res.status(400).send('Error al guardar la película');
        return res.status(201).send(data);
    })
    .catch((e) => { return res.status(500).json({ error: e }); } )
}
async function handleGetPeliculasRequest(req, res) {
    await peliculaCollection.find().toArray()
    .then((data) => {return res.status(200).send(data)})
    .catch((e) => { return res.status(500).send({ error: e }); } )
}

async function handleGetPeliculaByIdRequest(req, res) {
    let id = req.params.id;
    try {
        let oid = ObjectId.createFromHexString(id);

        await peliculaCollection.findOne({_id: oid})
        .then((data) => {
            if(data === null) return res.status(404).send('No se encontró la película con el id proporcionado');
            return res.status(200).send(data);
        })
        .catch((e) => { return res.status(500).send({ error: e }); } )
    }


    catch (e) {
        return res.status(400).send('El id de la película no es válido');
    }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    let id = req.params.id;
    let data = req.body;
    try {
        let oid = ObjectId.createFromHexString(id);
        let query = { $set: data };
        await peliculaCollection.updateOne({_id: oid}, query)
        .then((data) => {return res.status(200).send(data)})
        .catch((e) => { return res.status(500).send({ code: e.code }); } )
    }catch (e) {
        return res.status(400).send('El id de la película no es válido');
    }

}

async function handleDeletePeliculaByIdRequest(req, res) {
    let id = req.params.id;
    try {
        let oid = ObjectId.createFromHexString(id);
        await peliculaCollection.deleteOne({_id: oid})
        .then((data) => {
            if(data.deletedCount === 0) return res.status(404).send('No se encontró la película con el id indicado');
            return res.status(200).send(data);
        })
        .catch((e) => { return res.status(500).send({ error: e }); } )
    } catch (e) {
        return res.status(400).send('El id de la película no es válido');
    }
}

const controller = {
    handleInsertPelicula,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest,
};

export default controller;
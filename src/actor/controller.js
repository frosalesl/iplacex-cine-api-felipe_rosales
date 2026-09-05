import { ObjectId } from "mongodb";
import cliente from "../common/dbconn.js";
import { Actor } from "./actor.js"

const actorCollection = cliente.db("cine-db").collection("actores")
const peliculaCollection = cliente.db("cine-db").collection("peliculas")

async function handleInsertActorRequest(req, res) {
    let data = req.body
    let actor = {...Actor}

    await peliculaCollection.findOne({ nombre: data.pelicula})
    .then(async (pelicula) => {
        if(pelicula == null)
            return res.status(404).send("Pelicula no encontrada")

        actor.idPelicula = pelicula._id.toString()
        actor.nombre = data.nombre
        actor.edad = data.edad
        actor.estaRetirado = data.estaRetirado
        actor.premios = data.premios

        await actorCollection.insertOne(actor)
        .then((data) => {
            if (data == null)
                return res.status(400).send("Error al guardar registro")

            return res.status(201).send(data)
        })
        .catch((e) => {
            return res.status(500).send({ error: e })
        })
    })
    .catch((e) => {
        return res.status(500).send({ error: e })
    })
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((data) => {
        return res.status(200).send(data)
    })
    .catch((e) => {
        return res.status(500).send({ error: e})

    })
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid})
        .then((data) => {
            if (data == null)
                return res.status(404).send(data)

            return res.status(200).send(data)
        })
        .catch((e) => {
            return res.status(500).send({ error: e })
        })
    } catch (e) {
        return res.status(400).send("Id mal formado")
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
    let id = req.params.pelicula

    try {
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.findOne({ _id: oid})
        .then(async (pelicula) => {
            if (pelicula == null)
                return res.status(404).send("Pelicula no encontrada")

            await actorCollection.find({ idPelicula: id}).toArray()
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((e) => {
                return res.status(500).send({ error: e})
            })
        }).catch((e) => {
            return res.status(500).send({ error: e})
        })
    } catch(e){
        return res.status(400).send("Id mal formado")
    }
}

export default{
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}
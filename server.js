import express, {urlencoded} from "express";
import cors from 'cors';
import client from './src/common/dbconn.js';
import actorRoutes from './src/actor/actorRoutes.js';
import peliculaRoutes from './src/pelicula/peliculaRoutes.js';

const PORTS = 3000 || 4000;
const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors());

app.use('/api', actorRoutes);
app.use('/api', peliculaRoutes);

app.all('/', (req, res) => {return res.status(200).send('Bienvenido al cine IPLACEX')});

await client.connect()
.then (() => {
  console.log('Conectado al clúster');
  app.listen(PORTS, () => {console.log(`Servidor corriendo en http://localhost:${PORTS}`)});
})
.catch((error) => {
    console.log('Ha ocurrido un error al conectar al clúster de Atlas');
    console.error(error);
});

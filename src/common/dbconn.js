import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = "mongodb+srv://frosaleslillo_db_user:20TuftY5oTKZaprR@cine-db.bbdf0fd.mongodb.net/?appName=cine-db"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

export default client;


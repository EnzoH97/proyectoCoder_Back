import { connect } from "mongoose";

export async function connectToMongo() {
    try {
        
        const db = await connect("mongodb+srv://enzoarielherreraortega97_db_user:JFnnkFXBfof43H0h@cluster0.vja68h4.mongodb.net/La_taza_de_la_abuela?appName=Cluster0/CoderBack");
        
        console.log("Conectado con éxito a MongoDB Atlas");
        return db;
    } catch (error) {
        console.error("Error al conectar a MongoDB Atlas:", error);
        process.exit(1);
    }
}

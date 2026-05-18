
import {fileURLToPath} from "url";
import {dirname} from "path";
import multer from "multer";

const filename = fileURLToPath(import.meta.url);
export const root = dirname(filename);


const storage = multer.diskStorage({

    //Esto define el destino donde se va a guardar el archivo
    destination: (req, file, cb) =>{
        cb(null, root + "/public/img")
    },

    //Este define el nombre que va a tener el arcivo
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")){
            cb(null, true);
        }else{
            cb(new Error("Formato erroneo, solo se permiten imagenes"), false)
        }
    }
})
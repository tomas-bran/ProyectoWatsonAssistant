const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")

require("dotenv").config(); // funcionalidad de todo el archivo

const path = require("path");
const { healthGet } = require("./health");

const { whatsappAdap } = require("./Adapatadores/whatsappAdaptador");
const { whatsappOrq } = require("./Orquestadores/whatsappOrquestador");
const { watsonAdap } = require("./Adapatadores/watsonAdaptador");
const { watsonOrq } = require("./Orquestadores/watsonOrquestador");
const { whatsappControlador } = require("./Controladores/whatsappControlador");
const {telegramControlador} = require("./Controladores/telegramControlador");
const { buscarEvento } = require("./services/buscarEvento");
const { crearReserva } = require("./services/crearReserva");
const { consultarReserva } = require("./services/consultarReserva");
const { borrarReserva } = require("./services/borrarReserva");



const app = express();



app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get("/", (req, res) => {
    const pathfinder = path.join(__dirname, "index.html");
    res.sendFile(pathfinder);
})

app.get("/health", healthGet);


app.post("/whatsapp", (req,res)=>{
    whatsappControlador(req.body);
    res.status(200).send("llego");
});


telegramControlador();

app.post("/BuscarEvento",async (req,res)=>{
    console.log(req.body);
    const respuesta = await buscarEvento(req.body);
    if(Object.keys(respuesta).length===0){
        res.status(404).send("No hay Evento con esa fecha");
    }
    else
    res.status(200).send(respuesta);
});

app.post("/CrearReserva",async (req,res)=>{
    
    const respuesta=await crearReserva(req.body);
    res.status(200).send(respuesta);

})

app.post("/ConsultarReserva",async(req,res)=>{
    
    const respuesta = await consultarReserva(req.body);
    if(Object.keys(respuesta).length===0){
        res.status(404).send("No Posee una reserva para ese Evento");
    }
    else
    res.status(200).send(respuesta);
})

app.post("/BorrarReserva",async(req,res)=>{

    const respuesta = await borrarReserva(req.body);
    if(Object.keys(respuesta).length===0){
        res.status(404).send("No se pudo borrar debido a que no tiene una reserva");
    }
    else
    res.status(200).send(respuesta);
})



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Server corriendo en puerto", port);
})


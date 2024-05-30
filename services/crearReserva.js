const axios = require("axios");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const cloudanturl = process.env.CLOUDANT_URL
  
const auth = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY,
});

const service = CloudantV1.newInstance({ authenticator: auth });

service.setServiceUrl(cloudanturl);

const crearReserva = async (respuesta)=>{

    try {
    const event = respuesta.nombreEvento.toUpperCase();

    let objeto = {};
    const documentos = await axios({
      method: "POST",
      url: cloudanturl + "/eventpro/_find",
      data: {
        selector: {
          dia: respuesta.fecha,
          nombre: event,
        },
        fields: [],
      },
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.CLOUDANT_APIKEY,
      },
    });

    const {_id} = documentos.data.docs[0]

    const document =(
        await service.getDocument({
          docId: _id,
          db: "eventpro",
        })
      ).result;

    const CostoTotal = document.costo_entradas * respuesta.cantEntradasPedidas;

    console.log(respuesta)
    
    objeto = {
        nombre : respuesta.nombre,
        dni : respuesta.dni,
        cantEntradasPedidas : respuesta.cantEntradasPedidas,
        totalVenta : CostoTotal
    }


    document.reservas.reservas_realizadas.push(objeto);
    document.reservas.entradas_libres -= respuesta.cantEntradasPedidas;

    console.log("HOLA SOY EL DOCU MODIFICADO\n",document);  

    document.rev = (
        await service.postDocument({
            db:"eventpro",
            document,
        })
    ).result.rev;

    console.log("Estoy dentro del Endpoint CrearReserva: ",objeto);
    return objeto;
        
    } catch (error) {
        console.error("A continuacion el siguienbte error: \n",error);
    }






}

module.exports={crearReserva}
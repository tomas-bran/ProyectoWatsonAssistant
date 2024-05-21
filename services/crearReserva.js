const axios = require("axios");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const cloudanturl =
  "https://apikey-v2-2tyzcp6h6jo01d29acdzgu45ma9sy2to1ge79z4xpm79:2c43f7b572f7cc92c3b155c54e256dd8@fad04c60-e33c-49c7-9366-1c61369b3bf7-bluemix.cloudantnosqldb.appdomain.cloud";
const auth = new IamAuthenticator({
  apikey: "K4vJc65itr1F9NR2cXZsun0b6Fn1KqobIULGw1m8IfjJ",
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
        apikey: "K4vJc65itr1F9NR2cXZsun0b6Fn1KqobIULGw1m8IfjJ",
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
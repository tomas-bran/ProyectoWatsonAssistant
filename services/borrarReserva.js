const axios = require("axios");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const cloudanturl = process.env.CLOUDANT_URL
const auth = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY,
});

const service = CloudantV1.newInstance({ authenticator: auth });

service.setServiceUrl(cloudanturl);

const borrarReserva = async (respuesta) => {
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
    let nuevoArray = [];
    //

    if (documentos.data.docs.length > 0) {
      const { _id } = documentos.data.docs[0];

      const document = (
        await service.getDocument({
          docId: _id,
          db: "eventpro",
        })
      ).result;
      for await (const item of document.reservas.reservas_realizadas) {
        if (item.dni === respuesta.dni) {
          nuevoArray = document.reservas.reservas_realizadas.filter((objeto) => objeto.dni !== respuesta.dni);

          document.reservas.reservas_realizadas = nuevoArray;
          document.reservas.entradas_libres+=item.cantEntradasPedidas;

          objeto = {
            borrado: "Borrado exitosamente",
          };

          document.rev = (
            await service.postDocument({
              db: "eventpro",
              document,
            })
          ).result.rev;
        }
      }
    }

    console.log("Estoy dentro del Endpoint BorrarReserva: ",objeto);
    return objeto;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { borrarReserva };

const axios = require("axios");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const cloudanturl = process.env.CLOUDANT_URL
const auth = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY,
});

const service = CloudantV1.newInstance({ authenticator: auth });

service.setServiceUrl(cloudanturl);

const consultarReserva = async (respuesta) => {
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
    //

    if (documentos.data.docs.length > 0) {
      for await (const item of documentos.data.docs[0].reservas
        .reservas_realizadas) {
        if (item.dni === respuesta.dni) {
          objeto = {
            nombre: item.nombre,
            dni: item.dni,
            cantEntradasPedidas: item.cantEntradasPedidas,
            totalVenta: item.totalVenta,
          };
        }
      }
    }
    console.log("Estoy dentro del Endpoint ConsultarReserva: ", objeto);

    return objeto;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { consultarReserva };

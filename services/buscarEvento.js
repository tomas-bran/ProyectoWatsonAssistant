const axios = require("axios");
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const cloudanturl = process.env.CLOUDANT_URL
const auth = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY,
});

const service = CloudantV1.newInstance({ authenticator: auth });

service.setServiceUrl(cloudanturl);

const buscarEvento = async (respuesta) => {
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

    console.log(JSON.stringify(documentos.data));

    if (documentos.data.docs.length > 0) {
      objeto = {
        costo: documentos.data.docs[0].costo_entradas,
        horario: documentos.data.docs[0].horario,
        locacion: documentos.data.docs[0].locacion,
        direccion: documentos.data.docs[0].direccion,
        cantEntradas: documentos.data.docs[0].reservas.entradas_libres,
      };
    }
    console.log("Estoy dentro del Endpoint BuscarReserva: ", objeto);

    return objeto;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { buscarEvento };

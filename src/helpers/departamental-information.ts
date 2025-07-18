export const getDepartamentalInformation = (department: string) => {
  switch (department) {
    case "santander":
      return {
        name: "Santander",
        idParametro: 127,
        id_client_sci: 910,
        id_client_iuva: 1,
      };
    case "guajira":
      return {
        name: "Guajira",
        idParametro: 132,
        id_client_sci: 914,
        id_client_iuva: 20,
      };
    default:
      console.error("Departamento no encontrado");
  }
};

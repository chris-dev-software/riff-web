export type Document = {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  user_id: number;
  type: "REMUNERACION" | "GRATIFICACION";
  month:
    | "ENERO"
    | "FEBRERO"
    | "MARZO"
    | "ABRIL"
    | "MAYO"
    | "JUNIO"
    | "JULIO"
    | "AGOSTO"
    | "SEPTIEMBRE"
    | "OCTUBRE"
    | "NOVIEMBRE"
    | "DICIEMBRE";
  year: string;
  url: string;
  created_at: string;
};

export type DocumentUSER = {
  id: number;
  type: "REMUNERACION" | "GRATIFICACION";
  month:
    | "ENERO"
    | "FEBRERO"
    | "MARZO"
    | "ABRIL"
    | "MAYO"
    | "JUNIO"
    | "JULIO"
    | "AGOSTO"
    | "SEPTIEMBRE"
    | "OCTUBRE"
    | "NOVIEMBRE"
    | "DICIEMBRE";
  year: number;
  url: string;
  created_at: string;
};

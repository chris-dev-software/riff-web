export type Schedule = {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  user_id: number;
  weekday:
    | "LUNES"
    | "MARTES"
    | "MIERCOLES"
    | "JUEVES"
    | "VIERNES"
    | "SABADO"
    | "DOMINGO";
  start_time: string;
  end_time: string;
  created_at: string;
};

export type AddScheduleFormValues = {
  weekday:
    | "LUNES"
    | "MARTES"
    | "MIERCOLES"
    | "JUEVES"
    | "VIERNES"
    | "SABADO"
    | "DOMINGO";
  start_time: Date;
  end_time: Date;
  user_id: number;
};

export type ScheduleUSER = {
  id: number;
  weekday:
    | "LUNES"
    | "MARTES"
    | "MIERCOLES"
    | "JUEVES"
    | "VIERNES"
    | "SABADO"
    | "DOMINGO";
  start_time: string;
  end_time: string;
  created_at: string;
};

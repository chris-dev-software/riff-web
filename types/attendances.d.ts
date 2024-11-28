export type Attendance = {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  user_id: number;
  date: string;
  month: string;
  year: string;
  time_entry: string;
  time_departure: string;
  state: "PRESENTE" | "AUSENTE" | "TARDE" | "JUSTIFICADO";
  created_at: string;
};

export type AddAttendanceFormValues = {
  date: Date;
  time_entry: Date;
  time_departure: Date;
  state: "PRESENTE" | "AUSENTE" | "TARDE" | "JUSTIFICADO";
  user_id: number;
};

export type AttendanceUSER = {
  id: number;
  date: string;
  time_entry: string;
  time_departure: string;
  state: "PRESENTE" | "AUSENTE" | "TARDE" | "JUSTIFICADO";
  created_at: string;
};

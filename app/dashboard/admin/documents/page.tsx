import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { cookies } from "next/headers";
import Loading from "./loading";
import { Document } from "@/types";
import { DialogProvider } from "@/contexts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AddDocument } from "@/components/documents";

async function getData(): Promise<Document[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los documentos");
    }

    const data: any = await res.json();

    return formatDocumentData(data);
  } catch (error) {
    console.error("Error al obtener las asistencias:", error);
    return [];
  }
}

function formatDocumentData(documents: any[]): Document[] {
  return documents.map((document) => ({
    id: Number(document?.id),
    dni: document?.user?.dni,
    name: document?.user?.name,
    last_name: document?.user?.last_name,
    user_id: document?.user?.id,
    type: document?.type,
    month: document?.month,
    year: String(document?.year),
    url: document?.url,
    created_at: format(new Date(document.created_at), "dd/MM/yyyy", {
      locale: es,
    }),
  }));
}

export default async function DocumentsPage() {
  const data = await getData();

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">Documentos</h1>
          <p className="text-secondary text-base">
            Aqui podras visualizar los documentos asi como crearlos y
            eliminarlos
          </p>
        </div>
        <DialogProvider>
          <AddDocument />
        </DialogProvider>
      </div>
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}

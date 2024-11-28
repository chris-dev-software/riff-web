import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { cookies } from "next/headers";
import Loading from "./loading";
import { DocumentUSER } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

async function getData(): Promise<DocumentUSER[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/my-documents`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener los documentos");
    }

    const data: any = await res.json();

    return formatDocumentData(data);
  } catch (error) {
    console.error("Error al obtener las documentos:", error);
    return [];
  }
}

function formatDocumentData(documents: any[]): DocumentUSER[] {
  return documents.map((document) => ({
    id: Number(document?.id),
    type: document?.type,
    month: document?.month,
    year: document?.year,
    url: document?.url,
    created_at: format(new Date(document.created_at), "dd/MM/yyyy", {
      locale: es,
    }),
  }));
}

export default async function DocumentsPage() {
  const data = await getData();

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5">
      <div>
        <h1 className="text-3xl font-medium">Documentos</h1>
        <p className="text-secondary text-base">
          Aqui podras visualizar los documentos que se te asignaron
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Loading from "./loading";
import { DialogProvider } from "@/contexts";
import { AddUser } from "@/components/users";
import { useGetUsers } from "@/hooks";

export default async function UsersPage() {
  const data = await useGetUsers();

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">Usuarios</h1>
          <p className="text-secondary text-base">
            Aqui podras visualizar los usuarios asi como crearlos y eliminarlos
          </p>
        </div>
        <DialogProvider>
          <AddUser />
        </DialogProvider>
      </div>
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}

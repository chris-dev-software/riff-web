import { Suspense } from "react";
import Loading from "./loading";
import { notFound } from "next/navigation";
import { ProfileProvider } from "@/contexts/profile";
import { EditPassword, EditProfile } from "@/forms";
import { useGetUserProfile } from "@/hooks";

export default async function ProfilePage() {
  const userProfile = await useGetUserProfile();

  if (!userProfile) {
    notFound();
  }

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-10">
      <div>
        <h1 className="text-3xl font-medium">Perfil del Usuario</h1>
        <p className="text-secondary text-base">
          Aqui podras actualizar tus datos personal inclusive tu contraseña si
          lo requieres
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <ProfileProvider profile={userProfile}>
          <div className="flex flex-col gap-10 max-w-4xl">
            <div className="relative p-5 border border-neutral-300 rounded-md">
              <h1 className="absolute text-lg -top-3.5 bg-background px-2">
                Datos Personales
              </h1>
              <EditProfile />
            </div>
            <div className="relative p-5 border border-neutral-300 rounded-md">
              <h1 className="absolute text-lg -top-3.5 bg-background px-2">
                Seguridad
              </h1>
              <EditPassword />
            </div>
          </div>
        </ProfileProvider>
      </Suspense>
    </div>
  );
}

import { MenuAdmin, SelectOptionsAdmin } from "@/components/layout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[300px_1fr] overflow-auto">
      <MenuAdmin logout={SelectOptionsAdmin} />
      {children}
    </div>
  );
}

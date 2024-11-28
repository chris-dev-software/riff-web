import { MenuUser, SelectOptionsUser } from "@/components/layout";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[300px_1fr]">
      <MenuUser logout={SelectOptionsUser} />
      {children}
    </div>
  );
}

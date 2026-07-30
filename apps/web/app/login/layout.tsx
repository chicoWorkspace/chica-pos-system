export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {children}
    </div>
  );
}

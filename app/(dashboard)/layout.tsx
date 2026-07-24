// Dashboard group layout — clean passthrough
// The dashboard page handles its own layout via the Header component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

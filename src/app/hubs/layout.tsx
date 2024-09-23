import CustomLayout from "@/layout/CustomLayout";

export default function HubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <CustomLayout>{children}</CustomLayout>
  );
}

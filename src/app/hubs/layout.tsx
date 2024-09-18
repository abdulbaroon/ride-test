import CustomLayout from "@/layout/CustomLayout";

export default function HubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CustomLayout>{children}</CustomLayout>
    </div>
  );
}

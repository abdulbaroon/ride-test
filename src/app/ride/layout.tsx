import CustomLayout from "@/layout/CustomLayout";

export default function RideLayout({
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

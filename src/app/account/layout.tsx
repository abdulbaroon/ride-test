import CustomLayout from "@/layout/CustomLayout";

export default function AccountLayout({
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

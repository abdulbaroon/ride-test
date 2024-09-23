import CustomLayout from "@/layout/CustomLayout";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <CustomLayout>{children}</CustomLayout>
  );
}

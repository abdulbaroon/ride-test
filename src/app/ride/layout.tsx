import CustomLayout from "@/layout/CustomLayout";

/**
 * RideLayout component to wrap ride-related pages.
 *
 * This component provides a consistent layout for all ride pages,
 * ensuring they are rendered within the CustomLayout.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * 
 * @returns {JSX.Element} The rendered RideLayout component.
 */
export default function RideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <CustomLayout>{children}</CustomLayout>
  );
}

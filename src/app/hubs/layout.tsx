import CustomLayout from "@/layout/CustomLayout";

/**
 * Props for the HubsLayout component.
 * @typedef {Object} HubsLayoutProps
 * @property {React.ReactNode} children - The child components to be rendered within the layout.
 */

/**
 * Hubs layout component.
 *
 * This component wraps its children in a custom layout for the hubs section.
 *
 * @param {HubsLayoutProps} props - The component props.
 * @returns {JSX.Element} The rendered Hubs layout with children.
 */
export default function HubsLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <CustomLayout>{children}</CustomLayout>
  );
}

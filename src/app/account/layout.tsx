import CustomLayout from "@/layout/CustomLayout";

/**
 * Props for the AccountLayout component.
 * @typedef {Object} AccountLayoutProps
 * @property {React.ReactNode} children - The child components to be rendered within the layout.
 */

/**
 * Account layout component.
 *
 * This component wraps its children in a custom layout for account-related pages.
 *
 * @param {AccountLayoutProps} props - The component props.
 * @returns {JSX.Element} The rendered Account layout with children.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <CustomLayout>{children}</CustomLayout>;
}

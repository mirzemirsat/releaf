import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SiteChromeProvider, { type ProductDisplayMap } from "@/components/SiteChromeProvider";
import { getContent, getCatalog } from "@/lib/content/store";

/**
 * Public storefront chrome. Content (nav labels, footer, product
 * names/photos for the cart) is loaded from the content store, so
 * admin edits appear everywhere after revalidation.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [content, catalog] = await Promise.all([getContent(), getCatalog()]);
  const productDisplay: ProductDisplayMap = Object.fromEntries(
    catalog.map((p) => [p.slug, { name: p.name, image: p.image }])
  );

  return (
    <SiteChromeProvider global={content.global} products={productDisplay}>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </SiteChromeProvider>
  );
}

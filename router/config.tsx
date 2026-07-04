import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ProductsPage from "../pages/products/page";
import ProductDetailPage from "../pages/product-detail/page";
import AboutPage from "../pages/about/page";
import FAQPage from "../pages/faq/page";
import ContactPage from "../pages/contact/page";
import CartPage from "../pages/cart/page";
import CheckoutPage from "../pages/checkout/page";
import OrdersPage from "../pages/orders/page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/product/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

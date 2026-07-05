import Navbar from "./Navbar";

// Standard page chrome: sticky navbar + centered content column
const Layout = ({ children, wide = false }) => (
  <>
    <Navbar />
    <main className={`page ${wide ? "page-wide" : ""}`}>{children}</main>
  </>
);

export default Layout;

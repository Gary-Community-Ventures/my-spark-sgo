import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;

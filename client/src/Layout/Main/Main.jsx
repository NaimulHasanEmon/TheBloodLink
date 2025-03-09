import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

const Main = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <div className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main; 
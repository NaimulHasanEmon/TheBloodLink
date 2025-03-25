import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import SearchCounter from "../../components/SearchCounter";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <SearchCounter />
      <main className="flex-grow w-full">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Main; 
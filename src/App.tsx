import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainSidebar from "@/components/MainSidebar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductPage from "@/pages/ProductPage";
import Blog from "@/pages/Blog";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <MainSidebar />
        <main className="flex-1 w-full md:w-[calc(100%-16rem)] overflow-auto p-8">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
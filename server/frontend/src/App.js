import Products from "./components/Products/Products";
import Product from "./components/Products/Product";
import Home from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:asin" element={<Product />} />
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
export default App;

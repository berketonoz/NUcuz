import React, { useState, useEffect } from "react";
import "./Products.css";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState(null);

  const products_url = "http://localhost:3030/products"; // "http://localhost:8000/djangoapp/load_amazon"; // Adjust the URL if needed

  const getProducts = async () => {
    try {
      const url = `${products_url}`;
      await fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            setProductsList(data.products);
            setFilteredProducts(data.products);
          } else {
            setError("Failed to fetch products");
          }
        });
    } catch (err) {
      console.error("Error fetching products: ", err);
      setError("Error fetching products");
    }
  };

  const searchHandle = async (input) => {
    if (input) {
      setFilteredProducts(
        productsList.filter((p) =>
          p.product_title.toLowerCase().includes(input)
        )
      );
    } else {
      setFilteredProducts(productsList);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="container-ver">
        <div className="container-hor">
          <div className="filter-container">Filter</div>
        </div>
        <div className="container-hor">
          <div className="search-container">
            <input
              className="search-bar"
              type="text"
              onChange={(e) => searchHandle(e.target.value)}
            />
          </div>
          <div className="cards-container">
            {filteredProducts.map((product, index) => (
              <div key={`${product.asin}-${index}`} className="card">
                <img src={product.product_photo} alt={product.product_title} />
                <div className="card-content">
                  <p className="card-asin">{product.asin}</p>
                  <h3 className="card-title">{product.product_title}</h3>
                  <p className="card-price">{product.product_price}</p>
                  <p className="card-description">
                    {product.product_description}
                  </p>
                  <a
                    href={product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    View Product
                  </a>
                  {isLoggedIn && (
                    <div>
                      <p>Reviews: {product.product_num_ratings}</p>
                      <p>Rating: {product.product_star_rating}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  const products_url = "http://localhost:8000/djangoapp/products";

  const toggle = (e) => {
    let e1 = document.getElementsByClassName("arrow");
    e1 = e1[0];
    e1.classList.toggle("active");
    e1.style.transition = "transform 0.2s ease";
    if (e1.classList.contains("active")) e1.style.transform = "rotate(45deg)";
    else e1.style.transform = "rotate(-45deg)";
    console.log(currencies);
  };

  const getProducts = async () => {
    try {
      const url = `${products_url}`;
      await fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            let currencies = Array.from(
              new Set(data.products.map((product) => product.currency))
            );
            console.log(currencies);
            setCurrencies(currencies);

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
          <div className="filter-container">
            Filters
            <div className="filter-item-bar">
              <div className="filter-item" onClick={(e) => toggle(e)}>
                Currency
                <div className="arrow"></div>
              </div>
              <div className="filter-currency">
                {currencies?.length > 0
                  ? currencies.map((currency, index) => (
                      <p key={currency} style={{ fontSize: "30px" }}>
                        {currency}
                      </p>
                    ))
                  : null}
              </div>
            </div>
          </div>
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
              <Link to={`/product/${product.asin}`}>
                <img src={product.product_photo} alt={product.product_title} />
              </Link>
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

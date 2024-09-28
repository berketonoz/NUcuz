import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Products.css";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [checkedState, setCheckedState] = useState({
    currency: {},
    rating: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    },
  });
  const ratings = [1, 2, 3, 4, 5];

  const products_url = "http://localhost:8000/djangoapp/products";

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
            // setCurrencies(currencies);
            setCurrencies(["TRY", "USD"]);
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

  const handleFilter = () => {
    const { currency, rating } = checkedState;

    const newFilteredProducts = productsList.filter((product) => {
      // Check if the product's currency is checked
      const matchesCurrency = currency[product.currency] === true;
      // Check if the product's currency is checked
      const matchesRating = rating[Math.round(Number(product.product_star_rating))] === true;

      // If no filters are applied, return true for all products
      return (
        (
          !Object.values(currency).some((value) => value === true) ||
          matchesCurrency ) && 
        (
          !Object.values(rating).some((value) => value === true) ||
          matchesRating
        )
      );
    });
    setFilteredProducts(newFilteredProducts);
  };

  const handleCheckboxCurrency = (event) => {
    const { name, checked } = event.target;
    setCheckedState((prev) => ({
      ...prev,
      currency: {
        ...prev.currency,
        [name]: checked,
      },
    }));
    // handleFilter(); // Call filter after updating state
  };

  const handleCheckboxRating = (event) => {
    const { name, checked } = event.target;
    setCheckedState((prev) => ({
      ...prev,
      rating: {
        ...prev.rating,
        [name]: checked,
      },
    }));
    // handleFilter(); // Call filter after updating state
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

  // UseEffect to handle filtering when `checkedState` changes
  useEffect(() => {
    handleFilter();
  }, [checkedState]);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="container-ver">
        <div className="filter-container">
          <p className="filter-header">Filters</p>
          <div className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Currency</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {currencies.map((c, index) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedState.currency[c] || false}
                        onClick={handleCheckboxCurrency}
                        name={c}
                        key={index}
                      />
                    }
                    key={index}
                    label={c}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Rating</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {ratings.map((r, index) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedState.rating[r] || false}
                        onChange={handleCheckboxRating}
                        name={r.toString()}
                        key={index}
                      />
                    }
                    key={index}
                    label={r}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
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
                  <img
                    src={product.product_photo}
                    alt={product.product_title}
                  />
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

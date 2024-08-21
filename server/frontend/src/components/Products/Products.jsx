// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import "./Products.css";

// const Products = () => {
//   const [productsList, setProductsList] = useState([]);
//   const [error, setError] = useState(null);

//   console.log(window.location);
//   const protocol = window.location.protocol;
//   const hostname = window.location.hostname;
//   console.log(`Protocol: ${protocol}\nHostname: ${hostname}\nFull URL: ${protocol + hostname}`);
//   const products_url = window.location.protocol + '//' + window.location.hostname + ':8000/djangoapp/products';
//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const searchQuery = params.get("search") || "";

//     const getProducts = async () => {
//       try {
//         let url = `${products_url}?search=${searchQuery}`
//         const response = await fetch(url, { method: "GET" });
//         console.log("Response: ", response);
//         const data = await response.json();
//         if (data.status === 200) {
//           const all_products = Array.from(data.products);
//           setProductsList(all_products);
//         } else {
//           setError("Failed to fetch products");
//         }
//       } catch (err) {
//         console.error("Error fetching products: ", err);
//         setError("Error fetching products");
//       }
//     };

//     getProducts();
//   }, [location.search]);

//   const isLoggedIn = sessionStorage.getItem("username") !== null;

// return (
//   <div className="container">
//     {error && <div className="error">{error}</div>}
//     <table className="table">
//       <thead>
//         <tr>
//           <th>ASIN</th>
//           <th>Title</th>
//           <th>Price</th>
//           <th>Original Price</th>
//           <th>Currency</th>
//           <th>Rating</th>
//           <th>Reviews</th>
//           <th>URL</th>
//           <th>Photo</th>
//           <th>Offers</th>
//           <th>Min. Offer Price</th>
//           <th>Is Best Seller</th>
//           <th>Is Amazon Choice</th>
//           <th>Is Prime</th>
//           <th>Climate Friendly</th>
//           <th>Sales Volume</th>
//           <th>Delivery</th>
//           <th>Has Variations</th>
//           {isLoggedIn && <th>Review Dealer</th>}
//         </tr>
//       </thead>
//       <tbody>
//         {productsList.map((product, i) => (
//           <tr key={i}>
//             <td data-label="ASIN">{product.asin}</td>
//             <td data-label="Title">{product.product_title}</td>
//             <td data-label="Price">{product.product_price}</td>
//             <td data-label="Original Price">{product.product_original_price}</td>
//             <td data-label="Currency">{product.currency}</td>
//             <td data-label="Rating">{product.product_star_rating}</td>
//             <td data-label="Reviews">{product.product_num_ratings}</td>
//             <td data-label="URL">
//               <a href={product.product_url} target="_blank" rel="noopener noreferrer">
//                 Link
//               </a>
//             </td>
//             <td data-label="Photo">
//               <img
//                 src={product.product_photo}
//                 alt={product.product_title}
//               />
//             </td>
//             <td data-label="Offers">{product.product_num_offers}</td>
//             <td data-label="Min. Offer Price">{product.product_minimum_offer_price}</td>
//             <td data-label="Is Best Seller">{product.is_best_seller ? "Yes" : "No"}</td>
//             <td data-label="Is Amazon Choice">{product.is_amazon_choice ? "Yes" : "No"}</td>
//             <td data-label="Is Prime">{product.is_prime ? "Yes" : "No"}</td>
//             <td data-label="Climate Friendly">{product.climate_pledge_friendly ? "Yes" : "No"}</td>
//             <td data-label="Sales Volume">{product.sales_volume}</td>
//             <td data-label="Delivery">{product.delivery}</td>
//             <td data-label="Has Variations">{product.has_variations ? "Yes" : "No"}</td>
//             {isLoggedIn && <td data-label="Review Dealer">{/* Review Dealer button or content here */}</td>}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );
// };

// export default Products;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(16);

  const products_url = "http://localhost:8000/djangoapp/products"; // Adjust the URL if needed
  const location = useLocation();

  const checkProducts = async () => {
    const products = await fetch("http://localhost:3030/products")
      .then((response) => response.json())
      .then((data) => data);
    const filteredProducts = productsList.filter((product) => {
      return !products.some((p) => p.asin === product.asin);
    });
    console.log(filteredProducts);
  };

  useEffect(() => {
    // const params = new URLSearchParams(location.search);
    // const searchQuery = params.get("search") || "";

    const getProducts = async () => {
      try {
        const url = `${products_url}`; /*search=${searchQuery}`;*/
        await fetch(url, { method: "GET" })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 200) {
              setProductsList(data.products);
              console.log(data.products);
            } else {
              setError("Failed to fetch products");
            }
          });
      } catch (err) {
        console.error("Error fetching products: ", err);
        setError("Error fetching products");
      }
    };

    getProducts();
  }, [location.search]);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={checkProducts}>Submit</button>
      <div className="cards-container">
        {productsList.map((product, index) => (
          <div key={`${product.asin}-${index}`} className="card">
            <img src={product.product_photo} alt={product.product_title} />
            <div className="card-content">
              <h3 className="card-title">{product.product_title}</h3>
              <p className="card-price">{product.product_price}</p>
              <p className="card-description">{product.product_description}</p>
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
  );
};

export default Products;

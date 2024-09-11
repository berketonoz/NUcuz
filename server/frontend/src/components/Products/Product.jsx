import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Product.css";

const Product = () => {
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);

  //   let curr_url = window.location.href;
  //   let root_url = curr_url.substring(0, curr_url.indexOf("product"));
  let root_url = "http://localhost:8000/";
  let params = useParams();
  let asin = params.asin;
  let product_url = root_url + "djangoapp/product/" + asin;

  const GetProduct = () => {
    fetch(product_url, { method: "GET" })
      .then((data) => data.json())
      .then((res) => {
        let product = res.product[0];
        setProduct(product);
        console.log(product);
      });
  };

  useEffect(() => {
    GetProduct();
  }, []);

  return (
    <>
      <div className="product-container">
        <div className="product-title">{product.product_title}</div>
        <img src={product.product_photo} alt="" className="product-image" />
        <div className="product-price">{product.product_price}</div>
      </div>
    </>
  );
};

export default Product;

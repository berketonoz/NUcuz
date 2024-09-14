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
  let review_url = root_url + "djangoapp/reviews";

  const GetProduct = async () => {
    let p = await fetch(product_url, { method: "GET" })
      .then((data) => data.json())
      .then((res) => {
        let product = res.product[0];
        setProduct(product);
        return product;
      });

    fetch(review_url + `?asin=${p.asin}&country=${p.country}`, { method: "GET" })
      .then((data) => data.json())
      .then((res) => {
        let reviews = res.data;
        setReviews(reviews);
        return reviews;
      });
  };

  useEffect(() => {
    GetProduct();
  }, []);

  return (
    <>
      <div className="product-container">
        <img src={product.product_photo} alt="" className="product-photo" />
        <div className="product-brand">{product.product_brand}</div>
        <div className="product-title">{product.product_title}</div>
        {product.product_price && (
          <div className="product-price">{product.product_price}</div>
        )}
        {product.product_original_price && (
          <div className="product-price">{product.product_original_price}</div>
        )}
        <div className="product-rating">
          {/* <span className="stars">*****</span> */}
          <div>
            <span className="rating">{product.product_star_rating} </span>
            out of 5
          </div>
          <div>({product.product_num_ratings} ratings)</div>
        </div>
        <div className="delivery-info">
          <span>{product.delivery}</span>
        </div>
      </div>
    </>
  );
};

export default Product;

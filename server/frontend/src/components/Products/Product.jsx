import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Circles, ColorRing } from "react-loader-spinner";
import "./Product.css";
import Reviews from "./Reviews";

const Product = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true); // To manage loading state
  //   let curr_url = window.location.href;
  //   let root_url = curr_url.substring(0, curr_url.indexOf("product"));
  let root_url = "http://localhost:8000/";
  let params = useParams();
  let asin = params.asin;
  let product_url = `${root_url}djangoapp/product/${asin}`;

  const GetProduct = async () => {
    try {
      const response = await fetch(product_url, { method: "GET" });
      const res = await response.json();
      setProduct(res.product[0]);
      setLoading(false); // Loading finished
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    GetProduct();
  }, [asin]); // Dependency on 'asin' to re-fetch if the parameter changes

  if (!loading)
    return (
      <div className="product-spinner-container">
        <div className="circles">
          <ColorRing
            visible={true}
            height="400"
            width="400"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#bee9e8', '#62b6cb', '#1b4965', '#cae9ff', '#5fa8d3']}
            />
        </div>
      </div>
    ); // Handle loading state

  return (
    <>
      <div className="product-container">
        <img src={product.product_photo} alt="" className="product-photo" />
        <div className="product-brand">{product?.product_brand}</div>
        <div className="product-title">{product?.product_title}</div>
        <div className="product-price">{product?.product_price}</div>
        <div className="product-original-price">
          {product?.product_original_price}
        </div>
        <div className="product-rating">
          <div>
            <span className="rating">{product?.product_star_rating} </span>
            out of 5
          </div>
          <div>({product?.product_num_ratings} ratings)</div>
        </div>
        {product.delivery && (
          <div className="delivery-info">
            <span>{product?.delivery}</span>
          </div>
        )}
        <Reviews product={product} /> {/* Pass the correct product object */}
      </div>
    </>
  );
};

export default Product;

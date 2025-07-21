import React from 'react'
import {useEffect} from "react";
import { useProductStore } from '../store/ProductStore';
const Home = () => {
  const {products, loading, error, fetchProducts} = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log("products",products);
  return (
    <div>Home</div>
  )
}

export default Home
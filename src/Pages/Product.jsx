import React, { useContext } from 'react'
import {ShopContext} from '../Context/ShopContext'
import{ Link, useParams } from 'react-router-dom';
import Breadcrum from '../Components/BreadCrums/Breadcrum';
import ProductDispaly from '../Components/ProductDisplay/ProductDispaly';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RealtedProducts/RelatedProducts';

const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId}= useParams();
  const product = all_product.find((e) => e.id ===Number( productId));

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '32px' }}>
        <div style={{ maxWidth: '520px', textAlign: 'center', background: 'white', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
          <h1 style={{ marginBottom: '12px' }}>Product not found</h1>
          <p style={{ marginBottom: '24px', color: '#666', lineHeight: 1.6 }}>
            The product you’re looking for does not exist or the link is no longer valid.
          </p>
          <Link to="/" style={{ display: 'inline-block', padding: '14px 24px', borderRadius: '999px', textDecoration: 'none', color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontWeight: 700 }}>
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

   return (
    <div>
      <Breadcrum product={product}/>
      <ProductDispaly product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product

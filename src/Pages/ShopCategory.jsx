import React , {useContext, useState } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Asset/dropdown_icon.png'
import Item from '../Components/Item/Item';


const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState('Relevance');

  const handleSort = (type) => {
    setSortType(type);
    setSortOpen(false);
  };

//  console.log(props.category)
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src ={props.banner} alt="banner" />
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-12</span>out of 36 products
        </p>
        <div className="shopcategory-sort-container">
          <div className="shopcategory-sort" onClick={() => setSortOpen(!sortOpen)}>
            Sort by: <span>{sortType}</span> <img src={dropdown_icon} alt=""/>
          </div>
          {sortOpen && (
            <div className="shopcategory-sort-dropdown">
              <div className="sort-option" onClick={() => handleSort('Relevance')}>Relevance</div>
              <div className="sort-option" onClick={() => handleSort('Popularity')}>Popularity</div>
              <div className="sort-option" onClick={() => handleSort('Price: Low to High')}>Price: Low to High</div>
              <div className="sort-option" onClick={() => handleSort('Price: High to Low')}>Price: High to Low</div>
              <div className="sort-option" onClick={() => handleSort('Newest First')}>Newest First</div>
            </div>
          )}
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item,i)=>{
          if(props.category===item.category){
          return  <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                        old_price={item.old_price}
                        />
          }
          else{
            return null;
          }

        })}
          </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
          </div>

       
  )
}

export default ShopCategory

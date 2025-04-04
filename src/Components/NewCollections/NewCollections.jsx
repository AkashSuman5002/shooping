import React from 'react'
import './NewCollections.css'
import new_colllection from '../Asset/new_collections'
import Item from '../Item/Item'

const NewCollections = () => {
  return (
    <div className='newcollections'>
        <h1>NEW COLLECTIONS</h1>
        <hr/>
        <dv className="collections">
            {new_colllection.map((item,i) => {
                return <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                        old_price={item.old_price}
                        />
            })}
        </dv>
      
    </div>
  )
}

export default NewCollections

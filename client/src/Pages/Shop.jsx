import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Popularmen from '../Components/Popular/Popularmen'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'

const Shop = () => {
  return (
    <div>
        <Hero />
        <Popularmen/>
        <Popular/>
        <Offers/>
        <NewCollections/>
        <NewsLetter/>

    </div>
  )
}

export default Shop

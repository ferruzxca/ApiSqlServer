// src/components/Carousel.js
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';

const CarouselComponent = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await axios.get('/api/imagenes'); // Asegúrate de tener esta ruta en tu backend
      setImages(response.data);
    };
    fetchImages();
  }, []);

  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.urlImg} alt={`Imagen ${index}`} />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;

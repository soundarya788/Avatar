import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'react-image-gallery/styles/css/image-gallery.css';

export default function App() {
  const commonImageSrc = '/images/image+2.png'; 

  const [slides, setSlides] = useState([
    { original: '', thumbnail: '', show: false },
    { original: '/images/image+1.png', thumbnail: '/images/image+1.png', show: false },
    { original: '/images/image+5.png', thumbnail: '/images/image+5.png', show: false },
    { original: '/images/image+3.png', thumbnail: '/images/image+3.png', show: false },
    { original: '/images/image+7.png', thumbnail: '/images/image+7.png', show: false },
    { original: '/images/image+11.png', thumbnail: '/images/image+11.png', show: false },
    { original: '/images/image+4.png', thumbnail: '/images/image+4.png', show: false },
    { original: '/images/image+8.png', thumbnail: '/images/image+8.png', show: false },
  ]);

  const [slides2, setSlides2] = useState([
    { original: '', thumbnail: '', show: false },
    { original: '/images/image+1.png', thumbnail: '/images/image+1.png', show: false },
    { original: '/images/image+5.png', thumbnail: '/images/image+5.png', show: false },
    { original: '/images/image+7.png', thumbnail: '/images/image+7.png', show: false },
  ]);

  const [slides3, setSlides3] = useState([
    { original: '', thumbnail: '', show: false },
    { original: '/images/image+11.png', thumbnail: '/images/image+11.png', show: false },
    { original: '/images/image+4.png', thumbnail: '/images/image+4.png', show: false },
    { original: '/images/image+8.png', thumbnail: '/images/image+8.png', show: false },
  ]);

  const [mergedImage, setMergedImage] = useState(null);

  const [showCarousel, setShowCarousel] = useState(false);
  const [showCarousel2, setShowCarousel2] = useState(false);
  const [showCarousel3, setShowCarousel3] = useState(false);

  useEffect(() => {
    const mergeImages = async () => {
      const selectedSlides = slides.filter((slide) => slide.show);
      const selectedSlides2 = slides2.filter((slide) => slide.show);
      const selectedSlides3 = slides3.filter((slide) => slide.show);

      const commonImage = new Image();
      commonImage.src = commonImageSrc;
     
      await commonImage.decode();

      const commonImageWidth = commonImage.width ;
      const commonImageHeight = commonImage.height ;

      const selectedImgs = await Promise.all([
        ...selectedSlides.map((slide) => loadImage(slide.original)),
        ...selectedSlides2.map((slide) => loadImage(slide.original)),
        ...selectedSlides3.map((slide) => loadImage(slide.original)),
      ]);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false; 
      

      const carouselImageHeight = 90;
      const mergedWidth =  Math.floor(Math.max(commonImageWidth, ...selectedImgs.map((img) => img.width)));
      const mergedHeight =
      Math.floor(
        commonImageHeight +
          (selectedSlides.length + selectedSlides2.length + selectedSlides3.length) * carouselImageHeight +
          300);
      canvas.width = mergedWidth;
      canvas.height = mergedHeight;

      let offsetY = 10;

      selectedImgs.forEach(({ img, width, height }) => {
        
    
    ctx.drawImage(img, (mergedWidth - width) / 2, offsetY, width, height);
        offsetY += carouselImageHeight;
      });

      ctx.drawImage(
        commonImage,
        (mergedWidth - 60)/2,
         
        0,
        60, 
        60 
      );
      

      const mergedImageUrl = canvas.toDataURL("image/png", 1);
      setMergedImage(mergedImageUrl);
    };

    mergeImages();
  }, [slides, slides2, slides3, commonImageSrc]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve({ img, width: img.width, height: img.height });
      img.onerror = (error) => reject(error);
    });
  };

  
  
  
  const handleShowCarousel = (carouselNumber, showCarousel) => {
    switch (carouselNumber) {
      case 1:
        setShowCarousel(showCarousel);
        setShowCarousel2(false); 
        setShowCarousel3(false); 
        break;
      case 2:
        setShowCarousel(false); 
        setShowCarousel2(showCarousel);
        setShowCarousel3(false); 
        break;
      case 3:
        setShowCarousel(false); 
        setShowCarousel2(false); 
        setShowCarousel3(showCarousel);
        break;
      default:
        break;
    }
  };
  
  
  
  

  const downloadMergedImage = (event) => {
    event.preventDefault();
    if (mergedImage) {
      const link = document.createElement('a');
      link.href = mergedImage;
      link.download = 'merged-image.png';

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const image = new Image();
      image.src = mergedImage;

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 160, image.width, image.height + 10);

        canvas.toBlob((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          link.href = blobUrl;
          link.click();

          URL.revokeObjectURL(blobUrl);
        });

        localStorage.setItem('mergedImage', mergedImage);
        setMergedImage(null);
      };
    }
  };

  const customRenderItem = (item) => (
    <div className={`image-gallery-image${item.show ? ' show' : ''}`}>
      <div
        className="carousel-image"
        style={{
          backgroundImage: `url(${item.original})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '200px',
          height: '200px',
          margin: '0 auto',
          
        }}
      />
    </div>
  );

  return (
    <div className="App" style={{ width: '100%',  maxWidth: '1000px',height: '10vh', margin: '0 auto' }}>
      <div className="image-gallery-container" style={{ height: '450px' ,left:'-130px' }}>
        <div className="carousel-button-group">
          <button
             className={`carousel-button${showCarousel ? ' active' : ''}`}
            onClick={() => handleShowCarousel(1, !showCarousel)}
          >
            {showCarousel ? 'All images' : 'All images '}
          </button>
          <button
             className={`carousel-button${showCarousel2 ? ' active' : ''}`}
            onClick={() => handleShowCarousel(2, !showCarousel2)}
          >
            {showCarousel2 ? 'girls images' : 'girls images'}
          </button>
          <button
             className={`carousel-button${showCarousel3 ? ' active' : ''}`}
            onClick={() => handleShowCarousel(3, !showCarousel3)}
          >
            {showCarousel3 ? 'boys images' : 'boys images'}
          </button>
        </div>
        {showCarousel && (
          <ImageGallery
            items={slides}
            showPlayButton={false}
            showFullscreenButton={false}
            renderLeftNav={(onClick, disabled) => (
              <button
                className={`image-gallery-icon image-gallery-left-nav${disabled ? ' disabled' : ''}`}
                disabled={disabled}
                onClick={onClick}
              >
                <FaChevronLeft />
              </button>
            )}
            renderRightNav={(onClick, disabled) => (
              <button
                className={`image-gallery-icon image-gallery-right-nav${disabled ? ' disabled' : ''}`}
                disabled={disabled}
                onClick={onClick}
              >
                <FaChevronRight />
              </button>
            )}
            renderItem={customRenderItem}
            
            onSlide={(currentIndex,) => {
              const updatedSlides = slides.map((slide, index) => ({
                ...slide,
                show: index === currentIndex,
              }));
              setSlides(updatedSlides);
            }}
              
          />
        )}
        {showCarousel2 && (
          <ImageGallery
            items={slides2}
            showPlayButton={false}
            showFullscreenButton={false}
            renderLeftNav={(onClick, disabled) => (
              <button
                className={`image-gallery-icon image-gallery-left-nav${disabled ? ' disabled' : ''}`}
                disabled={disabled}
                onClick={onClick}
              >
                <FaChevronLeft />
              </button>
            )}
            renderRightNav={(onClick, disabled) => (
              <button
                className={`image-gallery-icon image-gallery-right-nav${disabled ? ' disabled' : ''}`}
                disabled={disabled}
                onClick={onClick}
              >
                <FaChevronRight />
              </button>
            )}
            renderItem={customRenderItem}
            onSlide={(currentIndex) => {
              const updatedSlides = slides2.map((slide, index) => ({
                ...slide,
                show: index === currentIndex,
              }));
              setSlides2(updatedSlides);
            }}
          />
        )}
        {showCarousel3 && (
          <ImageGallery
            items={slides3}
            showPlayButton={false}
            showFullscreenButton={false}
            renderLeftNav={(onClick, disabled) => (
              <button
                className={`image-gallery-icon image-gallery-left-nav${disabled ? ' disabled' : ''}`}
                disabled={disabled}
                onClick={onClick}
              >
                <FaChevronLeft />
              </button>
            )}
            renderRightNav={(onClick, disabled) => (
              <button
                className={`image-gallery-icon image-gallery-right-nav${disabled ? ' disabled' : ''}`}
                disabled={disabled}
                onClick={onClick}
              >
                <FaChevronRight />
              </button>
            )}
            renderItem={customRenderItem}
            onSlide={(currentIndex) => {
              const updatedSlides = slides3.map((slide, index) => ({
                ...slide,
                show: index === currentIndex,
              }));
              setSlides3(updatedSlides);
            }}
          />
        )}
      </div>

      <div style={{ marginTop: '-420px', bottom:'-100px',top: '100px',textAlign:'right', marginRight: '-130px'}}>
        {mergedImage && (
          <div>
            <img src={mergedImage} alt="Merged" width="200" />
          </div>
        )}
        <center>
        <div style={{ height: '100px',position:'absolute', marginTop:'-250px', marginBottom:'-10px',right:'-10px',  width: '100%'}}>
        <button onClick={downloadMergedImage}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          alignItems:'center',
          
          right:'-100px',
          
          
        }}
        >
          
          Merge and Download</button>
        </div>
        </center>
        
      </div>
    </div>
  );
}

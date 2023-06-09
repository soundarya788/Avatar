import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'react-image-gallery/styles/css/image-gallery.css';

export default function App() {
  const [commonImageSrc, setCommonImageSrc] = useState('/images/image+2.png');
  const [selectedImage] = useState(null); 
  const [cartoonImage, setCartoonImage] = useState(null);
  


  
  const handleCommonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCommonImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  

  const [slides, setSlides] = useState([
    { original: '', thumbnail: '', show: false },
    { original: '/images/image+1.png', thumbnail: '/images/image+1.png', show: false },
    { original: '/images/image+5.png', thumbnail: '/images/image+5.png', show: false },
    { original: '/images/image+3.png', thumbnail: '/images/image+3.png', show: false },
    { original: '/images/image+7.png', thumbnail: '/images/image+7.png', show: false },
    { original: '/images/image+15.png', thumbnail: '/images/image+15.png', show: false },
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
    { original: '/images/image+15.png', thumbnail: '/images/image+15.png', show: false },
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
    
      const commonImageWidth = Math.floor(commonImage.width);
      const commonImageHeight = Math.floor(commonImage.height);
    
      const selectedImgs = await Promise.all([
        ...selectedSlides.map((slide) => loadImage(slide.original)),
        ...selectedSlides2.map((slide) => loadImage(slide.original)),
        ...selectedSlides3.map((slide) => loadImage(slide.original)),
      ]);
    
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
    
      const carouselImageHeight = 60;
      const mergedWidth = Math.max(commonImageWidth, ...selectedImgs.map((img) => img.width));
      const mergedHeight =
        Math.floor(
          commonImageHeight +
          (selectedSlides.length + selectedSlides2.length + selectedSlides3.length) * carouselImageHeight +
          300
        );
      canvas.width = mergedWidth;
      canvas.height = mergedHeight;
    
      let offsetY = 1;
    
      selectedImgs.forEach(({ img, width, height }) => {
        ctx.drawImage(img, (mergedWidth - width) / 2, offsetY, width, height);
        offsetY += carouselImageHeight;
      });
      ctx.drawImage(commonImage, (mergedWidth - 50) / 2, 0, 50, 50);
    
      const mergedImageUrl = canvas.toDataURL('image/png', 1);
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

      const image = new Image();
      image.src = mergedImage;

      image.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 1080;
        const targetHeight = 1080;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const offsetX = (targetWidth - image.width) / 2;
        const offsetY = (targetHeight - image.height) / 2;

        ctx.fillStyle = 'white';
        ctx.fillRect(-10, 140, canvas.width - 70, canvas.height - 280);

        ctx.drawImage(image, offsetX - 100, offsetY + 100, image.width + 140, image.height + 680);

        canvas.toBlob((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          link.href = blobUrl;
          link.download = 'merged-image-1080.png';
          link.click();

          URL.revokeObjectURL(blobUrl);
        });
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

  const convertToCartoon = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('image', selectedImage);

       
        const response = await axios.post('https://api.gyanibooks.com/library/get_dummy_notes/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        
        const cartoonImageUrl = response.data.cartoonImageUrl;
        setCartoonImage(cartoonImageUrl);
      } catch (error) {
        console.error('Error converting image to cartoon:', error);
      }
    }
  };

  return (
    <div className="App" style={{ width: '100%', maxWidth: '1000px', height: '10vh', margin: '0 auto' }}>
      <div className="image-gallery-container" style={{ height: '450px', left: '-130px' }}>
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
            onSlide={(currentIndex) => {
              const updatedSlides = [...slides];
              updatedSlides.forEach((slide, index) => {
                slide.show = index === currentIndex;
              });
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
              const updatedSlides = [...slides2];
              updatedSlides.forEach((slide, index) => {
                slide.show = index === currentIndex;
              });
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
              const updatedSlides = [...slides3];
              updatedSlides.forEach((slide, index) => {
                slide.show = index === currentIndex;
              });
              setSlides3(updatedSlides);
            }}
          />
        )}
      </div>

      <div  style={{ marginTop: '-400px', top: '100px', textAlign: 'right', marginRight: '-110px',width: 'auto', height: 'auto'}}>
        {mergedImage && (
          <div>
            <img src={mergedImage} alt="Merged" style={{ width: 'auto', height: 'auto' ,position:'relative'}} />
          </div>
        )}
        <center>
          <div style={{ height: '10px', marginTop: '-50px', marginBottom: '-10px', right: '-10px' }}>
            <button
              onClick={downloadMergedImage}
              style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                alignItems: 'center',
                right: '-100px',
                
              }}
            >
              Merge and Download
            </button>
          </div>
        </center>
        <input
          type="file"
          style={{
            position:"absolute",
            top: 50,
            left: 50,
            zIndex: 1,
            
          }}
          accept="image/*"
          onChange= {handleCommonImageChange}
        />

        <div style={{position:'relative', top: '-70px', left: '-450px',marginRight:'-500px' }}>  
        {selectedImage && <img src={selectedImage} alt="Selected" />}
      
       <button onClick={convertToCartoon}>Convert to Cartoon</button>
            
       {cartoonImage && <img src={cartoonImage} alt="Cartoon" />}
        
      </div>
      </div>
      </div>
      
  
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'react-image-gallery/styles/css/image-gallery.css';

export default function App() {
  const [commonImageSrc, setCommonImageSrc] = useState('/images/image+2.png');
  const [selectedImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [cartoonImage, setCartoonImage] = useState(null);

  const [topPosition, setTopPosition] = useState(0);
  const [downPosition] = useState(0);
  const [slides, setSlides] = useState([
    { original: '/images/image+1.png', show: false },
    { original: '/images/image+5.png', show: false },
    { original: '/images/image+3.png', show: false },
    { original: '/images/image+7.png', show: false },
    { original: '/images/image+15.png', show: false },
    { original: '/images/image+4.png', show: false },
    { original: '/images/image+8.png', show: false },
  ]);

  const [mergedImage, setMergedImage] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const mergeImages = async () => {
      const selectedSlides = slides.filter((slide) => slide.show);
      const commonImage = new Image();
      commonImage.src = commonImageSrc;

      await commonImage.decode();

      const commonImageWidth = Math.floor(commonImage.width);
      const commonImageHeight = Math.floor(commonImage.height);

      const selectedImgs = await Promise.all(
        selectedSlides.map((slide) => loadImage(slide.original))
      );

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const carouselImageHeight = 60;
      const mergedWidth = Math.max(commonImageWidth, ...selectedImgs.map((img) => img.width));
      const mergedHeight =
        Math.floor(commonImageHeight + selectedSlides.length * carouselImageHeight + 300);
      canvas.width = mergedWidth;
      canvas.height = mergedHeight;

      let offsetY = 1 + topPosition;

      selectedImgs.forEach(({ img, width, height }) => {
        ctx.drawImage(img, (mergedWidth - width) / 2, offsetY, width, height);
        offsetY += carouselImageHeight;
      });
      ctx.drawImage(commonImage, (mergedWidth - 50) / 2, downPosition, 50, 50);

      const mergedImageUrl = canvas.toDataURL('image/png', 1);
      setMergedImage(mergedImageUrl);
    };

    mergeImages();
  }, [slides, commonImageSrc, topPosition, downPosition]);

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

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  const handleAddToCarousel = () => {
    if (newImageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const tempImageUrl = e.target.result;

        resizeImage(tempImageUrl, 150, 200, (resizedImageUrl) => {
          const newSlide = {
            original: resizedImageUrl,
            show: false,
          };
          setSlides((prevSlides) => [...prevSlides, newSlide]);
        });
      };
      reader.readAsDataURL(newImageFile);
      setNewImageFile(null);
    }
  };

  const handleCommonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCommonImageSrc(e.target.result);
        resizeImage(e.target.result, 150, 230, (resizedImageUrl) => {
          setCommonImageSrc(resizedImageUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (imageUrl, maxWidth, maxHeight, callback) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const resizedImageUrl = canvas.toDataURL('image/jpeg');
      callback(resizedImageUrl);
    };
  };

  const customRenderItem = (item) => (
    <div className={`image-gallery-image${item.show ? ' show' : ''}`}>
      <div className="carousel-image-box" style={{ width: '200px', height: '200px', margin: '0 auto', overflow: 'hidden' }}>
        <div
          className="carousel-image"
          style={{
            backgroundImage: `url(${item.original})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            
          }}
        />
      </div>
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
    <div style={{ position: 'fixed', top: 5, right: 40, padding: '10px' }}>
      <label htmlFor="topPosition" 
      style={{ position: 'fixed', top: '465px', left: '860px', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
        Adjust Position:
        </label>
      
      <input
        type="number"
        id="topPosition"
        value={topPosition}
        onChange={(e) => setTopPosition(Number(e.target.value))}
        style={{ marginLeft: '-190px',position:'relative', top: '450px'   }}
      />

      

      <div>
      <h4 style={{ position: 'fixed', top: '0px', left: '130px', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
          upload body image</h4>
        <input
          type="file"
          className="custom-file-input"
          style={{
            position: 'absolute',
            top: 50,
            left: -1010,
            zIndex: 1,
            backgroundColor: '#74b9ff',
          }}
          accept="image/*"
          onChange={handleNewImageChange}
        />

        <button
          onClick={handleAddToCarousel}
          style={{
            backgroundColor: '#44bd32',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            alignItems: 'center',
            right: '980px',
            position: 'fixed',
            top: '110px',
          }}
        >
          Add to images
        </button>

        <div className="App" style={{ width: '100%', maxWidth: '1000px', height: '10vh', margin: '0 auto' }}>
          <div className="image-gallery-container" style={{ height: '450px', left: '130px', top: '200px', position: 'fixed' }}>
            <div className="carousel-container" style={{ padding: '10px', top: '-100px' }}>
              <div className="carousel-button-group">
                <h3 style={{ position: 'fixed', top: '175px', left: '10px', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
                  Click  All images button to show images</h3>
                <button
                  className={`carousel-button${showCarousel ? ' active' : ''}`}
                  onClick={() => handleShowCarousel(1, !showCarousel)}
                >
                  {showCarousel ? 'All images' : 'All images '}
                </button>
              </div>
            </div>
            {showCarousel && (
              <ImageGallery
                items={slides}
                showPlayButton={false}
                showFullscreenButton={false}
                renderLeftNav={(onClick, disabled) => (
                  <button
                    style={{ position: 'absolute', top: 100, left: -40 }}
                    className={`image-gallery-icon image-gallery-left-nav${disabled ? ' disabled' : ''}`}
                    disabled={disabled}
                    onClick={onClick}
                  >
                    <FaChevronLeft />
                  </button>
                )}
                renderRightNav={(onClick, disabled) => (
                  <button
                    style={{ position: 'absolute', top: 100, left: 220 }}
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
          </div>

          <div style={{ position: 'relative', top: '-70px', left: '-450px', marginRight: '-500px', width: '200px' }}>
            {selectedImage && <img src={selectedImage} alt="Selected" />}
            <button onClick={convertToCartoon}>Convert to Cartoon</button>
            {cartoonImage && <img src={cartoonImage} alt="Cartoon" />}
          </div>
        </div>
      </div>

      <div className="merged">
        <div style={{ marginTop: '-400px', top: '600px', textAlign: 'right', marginRight: '-110px', width: 'auto', height: 'auto' }}>
          <div style={{ position: 'relative' }}>
            {mergedImage && (
              <div style={{ border: '2px solid black', marginTop: 400, height: '350px', width: '300px', position: 'fixed', right: '100px', backgroundColor: '#dcdde1' }}>
                <img src={mergedImage} alt="Merged" style={{ width: '200px', height: '600px', position: 'relative', top: '70px', left: '-40px' }} />
              </div>
            )}
          </div>
        </div>

        <center>
          <div style={{ height: '10px', marginTop: '-50px', marginBottom: '-10px', right: '-10px' }}>
            <button
              onClick={downloadMergedImage}
              style={{
                backgroundColor: '#44bd32',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                alignItems: 'center',
                right: '140px',
                position: 'relative',
                top: '810px',
              }}
            >
              Download
            </button>
          </div>
        </center>

        <h4 style={{ position: 'fixed', top: '-15px', left: '930px', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
          upload head image</h4>

        <input
          type="file"
          className="custom-file-input"
          style={{
            position: 'absolute',
            top: 40,
            right: '82px',
            zIndex: 1,
            backgroundColor: '#74b9ff',
          }}
          accept="image/*"
          onChange={handleCommonImageChange}
        />
      </div>
    </div>
  );
}
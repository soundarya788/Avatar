import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'react-image-gallery/styles/css/image-gallery.css';

export default function App() {
  const [slides, setSlides] = useState([
    { original: '', thumbnail: '', show: false },

    { original: '/images/image+1.png', thumbnail: '/images/image+1.png', show: false },
    { original: '/images/image+2.png', thumbnail: '/images/image+2.png', show:false },
    { original: '/images/image+3.png', thumbnail: '/images/image+3.png', show: false },
    { original: '/images/image+5.png', thumbnail: '/images/image+5.png', show: false },
    { original: '/images/image+11.png', thumbnail: '/images/image+11.png', show: false},
    { original: '/images/image+4.png', thumbnail: '/images/image+4.png', show: false },

    { original: '/images/image+8.png', thumbnail: '/images/image+8.png', show: false },
  ]);

  const [mergedImage, setMergedImage] = useState(null);

  useEffect(() => {
    const mergeImages = async () => {
      const selectedImages = slides.filter((slide) => slide.show);
      if (selectedImages.length > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const commonImage = new Image();
        commonImage.src = '/images/image+2.png';
        await commonImage.decode();

        const commonImageWidth = commonImage.width / 2;
        const commonImageHeight = commonImage.height / 2;

        const selectedImgs = await Promise.all(
          selectedImages.map((slide) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = slide.original;
              img.onload = () => resolve({ img, width: img.width, height: img.height });
              img.onerror = (error) => reject(error);
            });
          })
        );

        const carouselImageHeight = 200;
        const mergedWidth = Math.max(commonImageWidth, ...selectedImgs.map((img) => img.width));
        const mergedHeight =
          commonImageHeight + selectedImgs.length * carouselImageHeight + 100;
        canvas.width = mergedWidth;
        canvas.height = mergedHeight;

        let offsetY = 40;

        selectedImgs.forEach(({ img, width, height }) => {
          ctx.drawImage(img, (mergedWidth - width) / 2, offsetY, width, height);
          offsetY += 0;
        });

        ctx.drawImage(
          commonImage,
          (mergedWidth - commonImageWidth) / 2,
          20,
          commonImageWidth,
          commonImageHeight
        );

        const mergedImageUrl = canvas.toDataURL();
        setMergedImage(mergedImageUrl);
      } else {
        setMergedImage(null);
      }
    };

    mergeImages();
  }, [slides]);

  const downloadMergedImage = () => {
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
        ctx.drawImage(image, 0, 0, image.width, image.height+10);

        canvas.toBlob((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          link.href = blobUrl;
          link.click();

          URL.revokeObjectURL(blobUrl);
        }, 'image/png');
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
    <div className="App">
      <div className="image-gallery-container" style={{ height: '500px' }}>
        <img src="/images/image+2.png" width="100px" alt="common" className="center" />
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
            const updatedSlides = slides.map((slide, index) => ({
              ...slide,
              show: index === currentIndex,
            }));
            setSlides(updatedSlides);
          }}
        />
      </div>

      {mergedImage && (
        <div className="merged-image-container" style={{ textAlign: 'right', height: '500px', position: 'relative' }}>

        
          <div className="merged-image-wrapper">
            <img src={mergedImage} className="merged-image" alt="Merged" />
            <div className="download-button-container" style={{ position: 'absolute', bottom: '-500px', left: '550px' }} >
            
            <button className="download-button" onClick={downloadMergedImage} >
                Download merged Image
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
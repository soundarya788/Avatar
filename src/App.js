import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'react-image-gallery/styles/css/image-gallery.css';

export default function App() {
  const [slides, setSlides] = useState([
    { original: '/images/image+6.png', thumbnail: '/images/image+6.png', show: false },
    { original: '/images/image 5.png', thumbnail: '/images/image 5.png', show: false },
    { original: '/images/image+11.png', thumbnail: '/images/image+11.png', show: false },
    { original: '/images/image+4.png', thumbnail: '/images/image+4.png', show: false },
    { original: '/images/image+7.png', thumbnail: '/images/image+7.png', show: false },
    { original: '/images/image+8.png', thumbnail: '/images/image+8.png', show: false },
    { original: '/images/image+10.png', thumbnail: '/images/image+10.png', show: false },
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
            const img = new Image();
            img.src = slide.original;
            return new Promise((resolve, reject) => {
              img.onload = () => resolve(img);
              img.onerror = (error) => reject(error);
            });
          })
        );

        const mergedWidth = Math.max(commonImageWidth, ...selectedImgs.map((img) => img.width));
        const mergedHeight =
          commonImageHeight + selectedImgs.reduce((sum, img) => sum + img.height, 0) + 300;
        canvas.width = mergedWidth;
        canvas.height = mergedHeight;
        ctx.drawImage(
          commonImage,
          (mergedWidth - commonImageWidth) / 2,
          0,
          commonImageWidth,
          commonImageHeight
        );

        let offsetY = 8;

        selectedImgs.forEach((img) => {
          ctx.drawImage(img, (mergedWidth - img.width) / 2, offsetY);
          offsetY += img.height;
        });

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
      link.click();
    }
  };

  const customRenderItem = (item) => (
    <div className={`image-gallery-image${item.show ? ' show' : ''}`}>
      <img src={item.original} alt={item.originalAlt} style={{ width: '200px' }} />
    </div>
  );

  return (
    <div className="App">
      
      <div className="image-gallery-container">
        <img src="/images/image+2.png" width="100px" alt="common" />
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
          onSlide={(currentIndex, _) => {
            const updatedSlides = slides.map((slide, index) => ({
              ...slide,
              show: index === currentIndex,
            }));
            setSlides(updatedSlides);
          }}
        />
      </div>

      {mergedImage && (
        <div className="merged-image-container">
          &nbsp;
          <h1>merged image</h1>
          <img src={mergedImage} className="merged-image" alt="Merged" />
          <div className="download-button-container">
            <button className="download-button" onClick={downloadMergedImage}>
              Download Merged Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

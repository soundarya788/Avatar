import React, { useState, useEffect } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default function App() {
  const [slides, setSlides] = useState([
    { image: '/images/image+6.png', show: false },
    { image: '/images/image+5.png', show: false },
    { image: '/images/image+11.png', show: false },
    { image: '/images/image+4.png', show: false },
    { image: '/images/image+7.png', show: false },
    { image: '/images/image+8.png', show: false },
    { image: '/images/image+10.png', show: false },
  
  ]);

  const [mergedImage, setMergedImage] = useState(null);

  const toggleSlide = (index) => {
    setSlides((prevSlides) => {
      const updatedSlides = [...prevSlides];
      updatedSlides[index].show = !updatedSlides[index].show;
      return updatedSlides;
    });
  };

  useEffect(() => {
    const mergeImages = async () => {
      const selectedImages = slides.filter((slide) => slide.show);
      if (selectedImages.length > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const commonImage = new Image();
        commonImage.src = '/images/image+2.png';
        await commonImage.decode();

        const selectedImgs = await Promise.all(selectedImages.map((slide) => {
          const img = new Image();
          img.src = slide.image;
          return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
          });
        }));

        const mergedWidth = Math.max(commonImage.width, ...selectedImgs.map((img) => img.width));
        const mergedHeight = commonImage.height + selectedImgs.reduce((sum, img) => sum + img.height, 0) + 300;
        canvas.width = mergedWidth;
        canvas.height = mergedHeight;
        ctx.drawImage(commonImage, (mergedWidth - commonImage.width) / 2, 0);

        let offsetY = 90;
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

  return (
    <div>
      <CarouselProvider naturalSlideWidth={80} naturalSlideHeight={40} totalSlides={8}>
        <div className="App">
          <img src="/images/image+2.png" width="100px" className="center4" alt="Common" />
          <Slider>
            {slides.map((slide, index) => (
              <Slide key={index} index={index}>
                {slide.show && (
                  <img src={slide.image} className="center1" alt={`Slide ${index}`} />
                )}
                <button onClick={() => toggleSlide(index)}>
                  <img src={slide.image} width="200px" className="center" alt={`Slide ${index}`} />
                </button>
              </Slide>
            ))}
          </Slider>
          <div className="center">
            <ButtonBack>Back</ButtonBack>
            <ButtonNext>Next</ButtonNext>
          </div>
        </div>
      </CarouselProvider>

      {mergedImage && (
        <div>
          <h2>Merged Image:</h2>
          <canvas id="mergedCanvas" style={{ display: 'none' }}></canvas>
          <button onClick={downloadMergedImage}>Download Image</button>
        </div>
      )}
    </div>
  );
}

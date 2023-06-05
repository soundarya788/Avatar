import React, { useState, useEffect } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default function App() {
  const [slides, setSlides] = useState([
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+9.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+5.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+6.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+4.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+7.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+8.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+10.png', show: false },
    { image: 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+11.png', show: false },
  ]);

  const [mergedImage, setMergedImage] = useState(null);

  const commonImage = 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+2.png';

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

        const commonImg = await loadImage(commonImage);
        const selectedImgs = await Promise.all(selectedImages.map((slide) => loadImage(slide.image)));

        const mergedWidth = Math.max(commonImg.width, ...selectedImgs.map((img) => img.width));
        const mergedHeight = commonImg.height + selectedImgs.reduce((sum, img) => sum + img.height, 0) + 300;
        canvas.width = mergedWidth;
        canvas.height = mergedHeight;
        ctx.drawImage(commonImg, (mergedWidth - commonImg.width) / 2, 0);

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

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const downloadMergedImage = () => {
    if (mergedImage) {
      const link = document.createElement('a');
      link.href = mergedImage;
      link.download = 'merged_image.png';
      link.click();
    }
  };

  return (
    <div>
      <CarouselProvider naturalSlideWidth={80} naturalSlideHeight={40} totalSlides={8}>
        <div className="App">
          <img src={commonImage} width="100px" className="center4" alt="Common" />
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
          <img src={mergedImage} alt="Merged" />
          <button onClick={downloadMergedImage}>Download image</button>
        </div>
      )}
    </div>
  );
}

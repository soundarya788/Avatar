import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default function App() {
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const downloadMergedImage = async () => {
    const commonImage = 'https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+2.png';
    const selectedImg = selectedImage;

    const mergedImageUrl = await mergeImages(commonImage, selectedImg);
    downloadImage(mergedImageUrl);
  };

  const mergeImages = (commonImage, selectedImg) => {
    return new Promise((resolve, reject) => {
      const commonImageElement = new Image();
      commonImageElement.crossOrigin = 'Anonymous';
      commonImageElement.src = commonImage;

      const selectedImageElement = new Image();
      selectedImageElement.crossOrigin = 'Anonymous';
      selectedImageElement.src = selectedImg;

      const canvas = document.createElement('canvas');
      canvas.width = commonImageElement.width;
      canvas.height = commonImageElement.height;
      const context = canvas.getContext('2d');

      commonImageElement.onload = () => {
        context.drawImage(commonImageElement, 0, 0);
        selectedImageElement.onload = () => {
          context.drawImage(selectedImageElement, 0, 0);

          const mergedImageUrl = canvas.toDataURL('image/png');
          resolve(mergedImageUrl);
        };
      };
    });
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'merged_image.png';
    link.click();
  };

  const mergedImage = selectedImage ? (
    <img
      src={selectedImage}
      style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)' }}
      alt="Merged Image"
    />
  ) : null;

  return (
    <CarouselProvider naturalSlideWidth={80} naturalSlideHeight={40} totalSlides={8}>
      <div className="App">
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+2.png"
            width="100px"
            className="center4"
          />
          {mergedImage}
        </div>

        <Slider>
          <Slide index={0}>
            <div id="start">
              <h1></h1>
            </div>
            <button onClick={() => handleImageClick('https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+9.png')}>
              <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+9.png" width="200px" className="center" />
            </button>
          </Slide>

          <Slide index={1}>
            <div id="start"></div>
            <button onClick={() => handleImageClick('https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+8.png')}>
              <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+8.png" width="200px" className="center" />
            </button>
          </Slide>

          <Slide index={2}>
            <div id="start"></div>
            <button onClick={() => handleImageClick('https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+6.png')}>
              <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+6.png" width="200px" className="center" />
            </button>
          </Slide>

          <Slide index={3}>
            <div id="start"></div>
            <button onClick={() => handleImageClick('https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+7.png')}>
              <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+7.png" width="200px" className="center" />
            </button>
          </Slide>

          <Slide index={4}>
            <div id="start"></div>
            <button onClick={() => handleImageClick('https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+10.png')}>
              <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+10.png" width="200px" className="center" />
            </button>
          </Slide>

          <Slide index={5}>
            <div id="start"></div>
            <button onClick={() => handleImageClick('https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+11.png')}>
              <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+11.png" width="200px" className="center" />
            </button>
          </Slide>

        
        </Slider>

        <ButtonBack className="center">Back</ButtonBack>&nbsp;
        <ButtonNext className="center">Next</ButtonNext>

        <button onClick={downloadMergedImage}>Download Merged Image</button>
      </div>
    </CarouselProvider>
  );
}

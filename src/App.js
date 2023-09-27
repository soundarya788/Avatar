import React, { useState, useEffect } from 'react';

import 'react-image-gallery/styles/css/image-gallery.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

export default function App() {
  const [commonImageSrc, setCommonImageSrc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartoonImage] = useState(null);

  const [topPosition, setTopPosition] = useState(0);
  const [bodyLeftPosition, setBodyLeftPosition] = useState(0);

  const [mergedImage, setMergedImage] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [showSlides1] = useState(true);
  const [showSlides2, setShowSlides2] = useState(false); // State for Slides 2
  const [showSlides3, setShowSlides3] = useState(false); // State for Slides 3

  const [slides1] = useState([
    '/images/image+1.png',
    '/images/image+5.png',
    '/images/image+3.png',
    '/images/image+7.png',
    '/images/image+15.png',
  ]);

  const [slides2] = useState([
    '/images/image+1.png',
    '/images/image+5.png',
  ]);

  const [slides3] = useState([
    '/images/image+3.png',
    '/images/image+11.png',
  ]);

  

  const [currentSlides, setCurrentSlides] = useState(slides1);

  useEffect(() => {
    
    const mergeImages = async (headImageSrc, bodyImageSrc, top, left) => {
      const commonImage = new Image();
      commonImage.src = headImageSrc;

      await commonImage.decode();

      const commonImageWidth = Math.floor(commonImage.width);
      const commonImageHeight = Math.floor(commonImage.height);

      const bodyImage = new Image();
      bodyImage.src = bodyImageSrc;

      await bodyImage.decode();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const mergedWidth = Math.max(commonImageWidth, bodyImage.width);
      const mergedHeight = Math.floor(commonImageHeight + bodyImage.height + 200);
      canvas.width = mergedWidth;
      canvas.height = mergedHeight;

      const bodyXPosition = (mergedWidth - bodyImage.width) / 2 + left;
      const bodyYPosition = top;

      ctx.drawImage(bodyImage, bodyXPosition-160, bodyYPosition + 75, 500, 350);
      ctx.drawImage(commonImage, 30, 10, 250, 170);

      const mergedImageUrl = canvas.toDataURL('image/png', 1);
      setMergedImage(mergedImageUrl);
    };

    if (commonImageSrc) {
      if (selectedImage) {
        mergeImages(commonImageSrc, selectedImage, topPosition, bodyLeftPosition);
      } else {
        
        setMergedImage(null);
      }
    }
  }, [commonImageSrc, selectedImage, topPosition, bodyLeftPosition]);

  const handleCommonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resizeImage(e.target.result, 290, 230, (resizedImageUrl) => {
          setCommonImageSrc(resizedImageUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBodyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resizeImage(e.target.result, 100, 100, (resizedImageUrl) => {
          setSelectedImage(resizedImageUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarouselImageChange = (slide) => {
    setSelectedImage(slide);
  };

  const incrementTopPosition = () => {
    setTopPosition(topPosition + 1);
  };

  const decrementTopPosition = () => {
    if (topPosition > -100) {
      setTopPosition(topPosition - 1);
    }
  };

  const incrementBodyLeftPosition = () => {
    setBodyLeftPosition(bodyLeftPosition + 1);
  };

  const decrementBodyLeftPosition = () => {
    if (bodyLeftPosition > -100) {
      setBodyLeftPosition(bodyLeftPosition - 1);
    }
  };

  const resizeImage = (imageUrl, maxWidth, maxHeight, callback) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const width = maxWidth;
      const height = (width * img.height) / img.width;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);

      const resizedImageUrl = canvas.toDataURL('image/jpeg');
      callback(resizedImageUrl);
    };
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
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image, offsetX, offsetY);

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

  const toggleSlides1 = () => {
    setCurrentSlides(slides1);
    setShowSlides2(true);
    setShowCarousel(true);
    setShowSlides3(false);
  };

  const toggleSlides2 = () => {
    setCurrentSlides(slides2);
    setShowSlides2(true); 
    setShowCarousel(true); 
    setShowSlides3(false); 
  };

  const toggleSlides3 = () => {
    setCurrentSlides(slides3);
    setShowSlides3(false); 
    setShowCarousel(true); 
    setShowSlides2(false); 
  };

  
  return (
    
    <body style={{  margin: '0', padding: '0', height: '80px' }}>
      
      <div style={{ backgroundColor: '#192a56',height: '550px',transform: 'scale(0.9)' }}>
        <div className="container mt-5" style={{ marginTop: '20px' }}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label
                  htmlFor="headImageInput"
                  style={{ position: 'absolute', top: '10px', left: '130px', transform: 'translateX(-50%)', backgroundColor: '#ff3f34'  }}
                  className="btn btn-primary" 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg>
                  Upload
                  <input
                    type="file"
                    id="headImageInput"
                    accept="image/*"
                    style={{ display: 'none', position: 'absolute', top: '0', left: '0' }}
                    onChange={handleCommonImageChange}
                  />
                </label>
              </div>

              {commonImageSrc ? (
                <div className="p-3 mt-3" style={{ width: '200px', height: '200px', overflow: 'hidden', border: '5px dashed #ccc',marginLeft: '-30px',position: 'absolute',top: '40px',backgroundColor:'black' }}>
                  <img src={commonImageSrc} alt="Head" className="img-fluid" style={{ maxWidth: '100%' }} />
                </div>
              ) : (
                <div className="p-3 mt-3" style={{ width: '200px', height: '200px', border: '5px dashed #ccc',marginLeft: '-30px',position: 'absolute',top: '40px' ,backgroundColor:'black'}}>
                  <div className="text-center" style={{backgroundColor:'white'}}>Upload a head image</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '50px' }}>
               
              <div style={{ marginLeft: '280px', marginTop: '30px', position: 'absolute',backgroundColor:'black' }} className="col-md-3">
                <div  >
                <div className="form-group" >
                  {showCarousel ? (
                    <Carousel style={{border: '5px dashed #ccc',height:'160px'}}>
                      {currentSlides.map((slide, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={slide}
                            alt={`Body ${index}`}
                            className="img-fluid"
                            style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer',marginLeft:'90px' }}
                            onClick={() => handleCarouselImageChange(slide)}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : null }
                </div>
              </div>
              </div>
            </div>
          </div>

          <div style={{ marginLeft: '-30px', marginTop: '230px' ,position:'absolute' }} className="col-md-6">
            <div className="form-group">
              <label htmlFor="bodyImageInput" className="btn btn-primary" style={{backgroundColor: '#ff3f34'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg>
                Upload
                <input
                  type="file"
                  id="bodyImageInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleBodyImageChange}
                />
              </label>
            </div>
            {selectedImage ? (
              <div className="p-3 mt-3" style={{ width: '200px', height: '200px', overflow: 'hidden', border: '5px dashed #ccc',position: 'absolute',top: '30px' ,backgroundColor:'black' }}>
                <img
                  src={selectedImage}
                  alt="Body"
                  className="img-fluid"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            ) : (
              <div className="p-3 mt-3" style={{ width: '200px', height: '200px', border: ' 5px dashed #ccc',position: 'absolute',top: '30px' ,backgroundColor:'black' }}>
                <div className="text-center" style={{backgroundColor:'white'}}>Upload a body image</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '-100px' }}>
            <div className="row mt-5">
              <div className="col-md-12">
                <div
                  className="rounded p-3 d-flex justify-content-center align-items-center flex-column"
                  style={{
                    height: '300px',
                    width: '300px',
                    marginLeft: '760px',
                    marginTop: '-230px',
                    border: '8px dashed #ccc',
                    
                    position: 'absolute',
                    top:'270px',
                    background:'white',
                  }}
                >
                  {mergedImage && (
                    <div>
                      <img
                        src={mergedImage}
                        alt="Merged"
                        className="img-fluid"
                        style={{
                          maxWidth: '80%',
                          maxHeight: '80%',
                          marginTop: '-110px',
                          marginLeft: '-50px',
                          position: 'absolute',
                          backgroundColor:'white',
                          color:'white',
                          
                        }}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: '-338px', marginLeft: '-140px', position: 'absolute',backgroundColor:'white' }}>Adjust Positioning:</div>
                  <div style={{ position: 'absolute' }} className="mt-3">
                    <div style={{ position: 'absolute', marginTop: '-185px' }} className="d-flex">
                      <div style={{ marginLeft: '10px', marginTop: '-8px', position: 'absolute' }} className="mr-2">
                        <button onClick={decrementBodyLeftPosition}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708.708L5.707 7.5H11.5z" />
                          </svg>
                        </button>
                      </div>
                      <div style={{ marginTop: '-8px', marginLeft: '40px', position: 'absolute' }}>
                        <button onClick={incrementBodyLeftPosition}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-3.5 7.5a.5.5 0 0 1 0-1H10.293l-2.147-2.146a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 1 1-.708-.708L10.293 7.5H4.5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: '-194px', marginLeft: '70px', position: 'absolute' }}>
                      <button onClick={decrementTopPosition}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
</svg>
                      </button>
                    </div>
                    <div style={{ marginTop: '-194px', marginLeft: '100px', position: 'absolute' }}>
                      <button onClick={incrementTopPosition}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
</svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: '100px', marginTop: '-100px', position: 'absolute' }}>
       
        <button style={{ marginLeft: '860px', marginTop: '-90px', position: 'absolute',backgroundColor:'#05c46b' }}onClick={downloadMergedImage} className="btn btn-success">
          Download
        </button>
      </div>

      <div className="mt-5" style={{ marginLeft: '420px', marginTop: '-20px', position: 'absolute' }}>
        <div>
          <button
            className={`btn ${showSlides1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={toggleSlides1}
            style={{ marginRight: '20px',marginTop:'-1120px',backgroundColor:'#ff3f34' }}
          >
            Slides 1
          </button>
          <button
            className={`btn ${showSlides2 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={toggleSlides2}
            style={{ marginRight: '20px',marginTop:'-1120px',backgroundColor:'#ff3f34'}}
          >
            Slides 2
          </button>
          <button
            className={`btn ${showSlides3 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={toggleSlides3}
            style={{ marginRight: '10px',marginTop:'-1120px', backgroundColor:'#ff3f34' }}
          >
            Slides 3
          </button>
        </div>
      </div>

      <div
       
      >
        {cartoonImage ? (
          <img src={cartoonImage} alt="Cartoon" className="img-fluid" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ) : (
          <div className="text-center"></div>
        )}
      </div>
      <div  style={{marginTop:'-580px',marginLeft:'550px',position:'absolute',fontSize: '30px'}}>
      DreamikAI
      </div>
    </body>
  );
}
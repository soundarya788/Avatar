import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [commonImageSrc, setCommonImageSrc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartoonImage, setCartoonImage] = useState(null);

  const [topPosition, setTopPosition] = useState(0);
  const [bodyLeftPosition, setBodyLeftPosition] = useState(0);

  const [mergedImage, setMergedImage] = useState(null);

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

  useEffect(() => {
    const mergeImages = async () => {
      if (commonImageSrc && selectedImage) {
        const commonImage = new Image();
        commonImage.src = commonImageSrc;

       

        await commonImage.decode();
        

        const commonImageWidth = Math.floor(commonImage.width);
        const commonImageHeight = Math.floor(commonImage.height);

        const bodyImage = new Image();
        bodyImage.src = selectedImage;

        await bodyImage.decode();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const mergedWidth = Math.max(commonImageWidth, bodyImage.width);
        const mergedHeight = Math.floor(commonImageHeight + bodyImage.height + 300);
        canvas.width = mergedWidth;
        canvas.height = mergedHeight;

        const bodyXPosition = (mergedWidth - bodyImage.width) / 2 + bodyLeftPosition;
        const bodyYPosition = topPosition;

        ctx.drawImage(bodyImage, bodyXPosition, bodyYPosition + 75, 100, 130);
        ctx.drawImage(commonImage, 80, 10, 130, 80); 
        

        const mergedImageUrl = canvas.toDataURL('image/png', 1);
        setMergedImage(mergedImageUrl);
      }
    };

    mergeImages();
  }, [commonImageSrc, selectedImage, topPosition, bodyLeftPosition]);

  
  
    
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

  return (
    <div style={{height:'100px'}}>
    <div className="container mt-5" style={{ backgroundColor: '#f0f0f0' }}>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="headImageInput" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              Browse
              <input
                type="file"
                id="headImageInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCommonImageChange}
              />
            </label>
          </div>
          {commonImageSrc ? (
            <div className="p-3 mt-3" style={{ width: '200px', height: '200px', overflow: 'hidden', border: '1px dashed #ccc' }}>
              <img src={commonImageSrc} alt="Head" className="img-fluid" style={{ maxWidth: '100%' }} />
            </div>
          ) : (
            <div className="p-3 mt-3" style={{ width: '200px', height: '200px', border: '1px dashed #ccc' }}>
              <div className="text-center">Upload a head image</div>
            </div>
          )}
        </div>

        <div style={{ marginLeft: '300px', marginTop: '-250px' }} className="col-md-6">
          <div className="form-group">
            <label htmlFor="bodyImageInput" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              Browse
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
  <div className="p-3 mt-3" style={{ width: '200px', height: '200px', overflow: 'hidden', border: '1px dashed #ccc' }}>
    <img
      src={selectedImage}
      alt="Body"
      className="img-fluid"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    />
  </div>
) : (
  <div className="p-3 mt-3" style={{ width: '200px', height: '200px', border: '1px dashed #ccc' }}>
    <div className="text-center">Upload a body image</div>
  </div>
)}

        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <div className="rounded p-3 d-flex justify-content-center align-items-center flex-column" style={{ height: '300px', width: '300px', marginLeft: '700px', marginTop: '-250px',border: '4px dashed #ccc'  }}>
            {mergedImage && (
              <div>
                <img
                  src={mergedImage}
                  alt="Merged"
                  className="img-fluid"
                  style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '290px' ,marginLeft:'40px'}}
                />
              </div>
            )}
            <div style={{marginTop:'-350px',marginLeft:'-140px',position:'absolute'}}>Adjust Positioning:</div>
            <div style={{position:'absolute'}} className="mt-3">
            
              <div style={{ marginTop: '-200px', position: 'absolute' }} className="d-flex">
                <div style={{ marginLeft: '10px' }} className="mr-2">
                
                  <button  onClick={decrementBodyLeftPosition}>

                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0l-2.146 2.147H11.5z"/>
</svg>
                  </button>
                </div>
                <div className="mr-2">
                  <button  onClick={incrementTopPosition}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
</svg>
                  </button>
                </div>
                <div className="ml-2">
                  <button  onClick={decrementTopPosition}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 0-.708l-3-3a.5.5 0 1 1-.708.708L10.293 7.5H4.5z"/>
</svg>
                  </button>
                </div>
                <div className="ml-2">
                  <button  onClick={incrementBodyLeftPosition}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L10.293 7.5H4.5z"/>
</svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{marginLeft:'600px'}} className="text-center mt-3">
            <div style={{marginTop:'50px'}}> 
            <button
              onClick={downloadMergedImage}
              className="btn btn-success"
            >
              Download
            </button>
            </div>
          </div>
          <h4 className="mt-3" style={{ top: '200px' }}>Convert to Cartoon</h4>
          <div className="text-center">
            <button onClick={convertToCartoon} className="btn btn-primary">
              Convert to Cartoon
            </button>
          </div>
          {cartoonImage && (
            <div className="border p-3 mt-3">
              <img src={cartoonImage} alt="Cartoon" className="img-fluid" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
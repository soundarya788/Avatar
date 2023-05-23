import React ,{useState} from 'react';
import AWS from 'aws-sdk'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';


const S3_BUCKET ='s3account-aws';
const REGION ='ap-south-1';


AWS.config.update({
    accessKeyId: 'AKIAV27UBMIWJSSAXNOZ',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET},
  region: REGION,
})




const img5="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+5.png";
const img6="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+6.png";
const img7="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+7.png";
const img8="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+8.png";
const img9="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+9.png";
const img10="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+10.png";


const download = () => {
    var element = document.createElement("a");
    var file = new Blob(
      
      [
        "https://s3account-aws.s3.ap-south-1.amazonaws.com/images1.jpg"
      ],
      { type: "image/*" }
    );
    element.href = URL.createObjectURL(file);
    element.download = "image.jpg";
    element.click();
  };

  

const Location = () => {
const [displayImages, setDisplayImages] = React.useState({img5: false, img6: false, img7:false, img8:false, img9:false, img10:false});
const [show,setShow]= React.useState(false)


  const [progress , setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
  }

  const uploadFile = (file) => {

    

      const params = {
          ACL: 'public-read',
          Body: file,
          Bucket: S3_BUCKET,
          Key: file.name
      };

      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
              setProgress(Math.round((evt.loaded / evt.total) * 100))
          })
          .send((err) => {
              if (err) console.log(err)
          })
  }

    return (
      

      
        

      <CarouselProvider
   naturalSlideWidth={100}
   naturalSlideHeight={40}
  totalSlides={8}
  >
     <p align="right" left="300px" >

<select id="Align">
      
<option value="vertical" >vertical</option>
<option value="Horizontal" >Horizontal</option>
<option value="tilt" >tilts</option>



</select>
</p>



      <img src="https://s3account-aws.s3.ap-south-1.amazonaws.com/Avatar/image+2.png" class="center1" />

      
                


        <div>
        <Slider>
            <div className="Ccontainer">
            <Slide index={0}>
              
            <button onClick={()=>setDisplayImages({...displayImages, img5:true})}  float="left">
            <img src={img5}/>

           
            </button>
            <center>
              <a
            href="https://s3account-aws.s3.ap-south-1.amazonaws.com/download+image/images1.png"
            download
            onClick={() => download()}
          >
            <button onClick={()=>setShow(!show)} class="btn">
            <i className="fa fa-download" />
            download
            </button>
          </a>
          
          </center>
            </Slide>
            <Slide index={1}>
            <button onClick={()=>setDisplayImages({...displayImages, img6:true})} className="ground">
            <img src={img6}/>
            </button>
            <center>
              <a
            href="https://s3account-aws.s3.ap-south-1.amazonaws.com/download+image/images2.png"
            download
            onClick={() => download()}  
          >
            <button class="btn">
            <i className="fa fa-download" />
            download
            </button>
          </a>
          
          </center>
            
            </Slide>
            <Slide index={2}>
            
                <button onClick={()=>setDisplayImages({...displayImages, img7:true})} className="ground">
                <img src={img7}/>
                </button>
                <center>
              <a
            href="https://s3account-aws.s3.ap-south-1.amazonaws.com/download+image/images3.png"
            download
            onClick={() => download()}
          >
            <button class="btn">
            <i className="fa fa-download" />
            download
            </button>
          </a>
          </center>
                </Slide>

                <Slide index={3}>
            
                <button onClick={()=>setDisplayImages({...displayImages, img8:true})} className="ground">
                <img src={img8}/>
                </button>
                <center>
              <a
            href="https://s3account-aws.s3.ap-south-1.amazonaws.com/download+image/images4.png"
            download
            onClick={() => download()}
          >
            <button class="btn">
            <i className="fa fa-download" />
            download
            </button>
          </a>
          </center>
                </Slide>

                <Slide index={4}>
            
                <button onClick={()=>setDisplayImages({...displayImages, img9:true})} className="ground">
                <img src={img9}/>
                </button>
                <center>
              <a
            href="https://s3account-aws.s3.ap-south-1.amazonaws.com/download+image/images5.png"
            download
            onClick={() => download()}
          >
            <button class="btn">
            <i className="fa fa-download" />
            download
            </button>
          </a>
          </center>
                </Slide>

                <Slide index={5}>
            
                <button onClick={()=>setDisplayImages({...displayImages, img10:true})} className="ground">
                <img src={img10}/>
                </button>
                <center>
              <a
            href="https://s3account-aws.s3.ap-south-1.amazonaws.com/download+image/images6.png"
            download
            onClick={() => download()}
          >
            <button class="btn">
            <i className="fa fa-download" />
            download
            </button>
          </a>
          </center>
                </Slide>
                
            </div>
            </Slider> 
           
            


            
            
            
                 <div className= "image">
                 
                  <div>
              {displayImages.img5 &&  <img src={img5} class="center" alt="ground" />}
              <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
              
              </div>
              <div>
               {displayImages.img6 && <img src={img6} class="center" alt="first" />}
               </div>
               <div>
               {displayImages.img7 && <img src = {img7 } class="center" alt= "second" />}
               </div>
               <div>
               {displayImages.img8 && <img src={img8} class="center" alt="ground" />}
               </div>
               <div>
               {displayImages.img9 && <img src={img9} class="center" alt="ground" />}
               </div>
               <div>
               {displayImages.img10 && <img src={img10} class="center" alt="ground" />}
               </div>
                
                </div>

                <div className="App">

         
        </div>

        
       

           
        
       

                
            
    </div>
    
    </CarouselProvider>



    );
};


export default Location;
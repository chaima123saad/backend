const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dvw7882vz",
  api_key: "482828472586643",
  api_secret: "2Uh5CMgQI2doIyBWDTCs41XnqmA"
});


// Upload

const res = cloudinary.uploader.upload('./images/default-avatr.jpg', {public_id: "userAvatar"})

res.then((data) => {
  console.log(data);
  console.log(data.secure_url);
}).catch((err) => {
  console.log(err);
});


// Generate 
const url = cloudinary.url("userAvatar", {
  width: 100,
  height: 150,
  Crop: 'fill'
});



// The output url
console.log(url);
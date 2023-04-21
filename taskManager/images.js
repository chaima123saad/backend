const cloudinary = require('cloudinary').v2;

const images = (path) => {
    cloudinary.config({
        cloud_name: "dvw7882vz",
        api_key: "482828472586643",
        api_secret: "2Uh5CMgQI2doIyBWDTCs41XnqmA"
    });
    
    
    
const res = cloudinary.uploader.upload('./public/images/default-avatar.jpg', {public_id: "default-avatar"})
res.then((data) => {
  console.log(data);
  console.log(data.secure_url);
}).catch((err) => {
  console.log(err);
});

const url = cloudinary.url("default-avatar", {
  width: 100,
  height: 150,
  Crop: 'fill'
});
}
module.exports = images;

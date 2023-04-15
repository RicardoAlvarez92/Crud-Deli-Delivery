//Cloudinary
const cloudinary = require("../../cloudinary").v2;

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

// Upload
const res = cloudinary.uploader.upload('https://res.cloudinary.com/dlgkssswu/image/upload/v1679641001/samples/cloudinary-group.jpg', {public_id: "group"})

res.then((data) => {
    console.log(data);
    console.log(data.secure_url);
}).catch((err) => {
    console.log(err);
});

// Generate 
const url = cloudinary.url("group", {
    width: 100,
    height: 150,
    Crop: 'fill'
});

// The output url
/* console.log(url); */
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag

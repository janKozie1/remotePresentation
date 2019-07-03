let express = require('express');
const cors = require('cors');
let path = require('path')
let fs = require('fs')
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:'*'}))

const dirPath = path.join(__dirname,'images');

function base64_encode(file) {
    let bin = fs.readFileSync(file);
    return Buffer.from(bin).toString('base64');
}

app.post("/getImage",(req,res)=>{
    fs.readdir(dirPath, (err,files)=>{
        if(err){
            return console.log('unable to scan: ' + err)
        }else{
            res.setHeader('Content-Type','text/plain');
            let index = parseInt(req.body.index)
            let base64 = base64_encode(path.join(dirPath,files[index]));
            console.log(files.length,index)
            res.json({base64,last:index === files.length-1})
        }
    })
})

app.listen(4000,()=>{
    console.log('server start')
})
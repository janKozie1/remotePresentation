let express = require('express');
let hound = require('hound');
let cors = require('cors');
let path = require('path');
let fs = require('fs');
let ip = require("ip");
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:'*'}))

const dirPath = path.join(__dirname,'media');
const ACCEPTED_EXT = ['.jpg','.png','.gif','.mp4','.webm']

let watcher = hound.watch(dirPath);
let media = [];
let key = Math.random();
listFiles();

 
    
  


watcher.on('create', function(file, stats) {
    listFiles();
    key = Math.random();
})
watcher.on('change', function(file, stats) {
    listFiles();
    key = Math.random();
})
watcher.on('delete', function(file) {
    listFiles();
    key = Math.random();
})

app.post("/getImage",(req,res)=>{
    let duration = getConfig('defaultSlideDuration');
    if(req.body.key !== key){
        res.json({key,duration,media});
    }else{
        res.json({key})
    }
    
})

app.listen(4000,()=>{
    console.log('Server has started on:\n'+ip.address()+':4000')
})

function base64_encode(file) {
    try{
        let bin = fs.readFileSync(file);
        return Buffer.from(bin).toString('base64');
    }catch(err){
        return '';
    }
    
}

function getConfig(key){    
    let config = fs.readFileSync(path.join(dirPath,'_config.txt'), 'utf8');
    let propertyIndex = config.indexOf(key)+key.length-1;
    let endIndex = config.indexOf("\n",propertyIndex) === -1 ? config.length : config.indexOf("\n",propertyIndex)
    return config.substring(config.indexOf("=",propertyIndex)+1,endIndex).trim();
}

function listFiles(){
    fs.readdir(dirPath, (err,files)=>{
        if(err){
            console.log('unable to scan: ' + err)
            media =  [];
        }else{
            let temp = files.filter((e)=>{
                return ACCEPTED_EXT.includes(e.substr(e.lastIndexOf('.')).toLowerCase())
            })
        
            temp = temp.map((e)=>{
                let base64 = base64_encode(path.join(dirPath,e));
                if(base64)
                    return {fileName:e,base64}
            })
            media = [...temp.sort(compare)]
        }
    })
}

function compare( a, b ) {
    let temp1 = parseInt(a.fileName.replace(/[^0-9]/g,''));
    let temp2 = parseInt(b.fileName.replace(/[^0-9]/g,''));
      if ( temp1 < temp2 ){
      return -1;
    }
    if ( temp1 > temp2){
      return 1;
    }
} 
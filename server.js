let express = require('express');
let hound = require('hound');
let cors = require('cors');
let path = require('path');
let fs = require('fs');
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:'*'}))

const dirPath = path.join(__dirname,'images');

let watcher = hound.watch(dirPath);
let images = [];
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
    res.json({key,images});
})

app.listen(4000,()=>{
    console.log('server start')
})

function base64_encode(file) {
    try{
        let bin = fs.readFileSync(file);
        return Buffer.from(bin).toString('base64');
    }catch(err){
        return '';
    }
    
}
function listFiles(){
    fs.readdir(dirPath, (err,files)=>{
        if(err){
            console.log('unable to scan: ' + err)
            images =  [];
        }else{
            let temp = files.map((e)=>{
                let base64 = base64_encode(path.join(dirPath,e));
                if(base64)
                    return {fileName:e,base64}
            })
            images = [...temp.sort(compare)]
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
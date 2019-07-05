let express = require('express');
let hound = require('hound');
let cors = require('cors');
let path = require('path');
let fs = require('fs');
let ip = require("ip");
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }))

const dirPath = path.join(__dirname, 'Media');
const ACCEPTED_EXT = ['.jpg', '.png', '.gif', '.mp4', '.webm']
const POSSIBLE_PARAMS = ['duration', 'transition'];

let watcher = hound.watch(dirPath);
let media = [];
let key = Math.random();
let defaultDuration = getConfig('defaultSlideDuration');
listFiles();






watcher.on('create', function (file, stats) {
    listFiles();
    key = Math.random();
})
watcher.on('change', function (file, stats) {
    listFiles();
    key = Math.random();
})
watcher.on('delete', function (file) {
    listFiles();
    key = Math.random();
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})
app.post("/getImages", (req, res) => {
    let duration = getConfig('defaultSlideDuration');
    if (req.body.key !== key) {
        res.json({ key, duration, media });
    } else {
        res.json({ key })
    }

})

app.listen(4000, () => {
    console.log('Server has started on:\n' + ip.address() + ':4000')
})

function base64_encode(file) {
    try {
        let bin = fs.readFileSync(file);
        return Buffer.from(bin).toString('base64');
    } catch (err) {
        return '';
    }

}

function getConfig(key) {
    let config = fs.readFileSync(path.join(dirPath, '_config.txt'), 'utf8');
    let propertyIndex = config.indexOf(key) + key.length - 1;
    let endIndex = config.indexOf("\n", propertyIndex) === -1 ? config.length : config.indexOf("\n", propertyIndex)
    return config.substring(config.indexOf("=", propertyIndex) + 1, endIndex).trim();
}

function listFiles() {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.log('unable to scan: ' + err)
            media = [];
        } else {
            let temp = files.filter((e) => {
                return ACCEPTED_EXT.includes(e.substr(e.lastIndexOf('.')).toLowerCase())
            })

            temp = temp.map((e) => {
                let base64 = base64_encode(path.join(dirPath, e));
                let unparsed = e.substring(e.indexOf('_') + 1, e.lastIndexOf('.')).split('_').map((e) => {
                    return parseInt(e)
                });
                let params = POSSIBLE_PARAMS.reduce((prev, current, index) => {
                    unparsed[index] ? prev[current] = unparsed[index] : '';
                    return prev;
                }, {})
                if (base64)
                    return { fileName: e, params, base64 }
            })
            media = [...temp.sort(compare)]
        }
    })
}

function compare(a, b) {
    let temp1 = findIndex(a.fileName);
    let temp2 = findIndex(b.fileName)
    if (temp1 < temp2) {
        return -1;
    }else if (temp1 > temp2) {
        return 1;
    }else {
        return 0;
    }
} 
function findIndex(name){
	let firstDigit = name.match(/\d/);
	let index = name.indexOf(firstDigit);
	return parseInt(name.substring(index,name.indexOf('_')));
}
const path = require('path')
const fs = require('fs')
const axios = require('axios')

const rootcode = '530000'

const fetchFn = async (code, dirPath, hasChildren = true) => {
    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${code}${hasChildren?'_full':''}.json`
    try {
        const {data} = await axios.get(url)
        fs.writeFile(`${dirPath}/${code}.json`, JSON.stringify(data), err => {
            if (err) {
                console.log(`${code}.json 文件写入失败: ${err}`)
            }
        }) 
        const {features} = data
        if (features[0]['properties']['adcode'] !== code) {
            features.forEach(feature => {
               const { adcode: _code, childrenNum: _hasChildren, name: _name } = feature.properties
               generateJsonMap(_code, _name)
               fetchFn(_code, dirPath,_hasChildren) 
            });
        }
    } catch (error) {
        console.log(error) 
    }
}

const run = async () => {
   const dirPath = path.resolve(__dirname,'云南')
   // 创建之前先检测目录是否已经存在
   try {
    fs.accessSync(dirPath)
    fetchFn(rootcode, dirPath)
   } catch (error) {
    // 不存在则创建       
    fs.mkdirSync(dirPath)
   }
}

let imports  = ''
const codemapjson = {}
const treecodemap = {}
const generateJsonMap = (code, name) => {
    imports += `\n import ${name} from './json/${code}.json'`
    codemapjson[code] = name
    treecodemap[name] = code
    const content = imports + '\n\n\n\n' + `export const codemapjson = ${JSON.stringify(codemapjson)}` + '\n\n\n\n' + `export const treecodemap = ${JSON.stringify(treecodemap)}`
    fs.writeFile(path.resolve(__dirname, 'codemapjson.js'), content, err => {
        if (err) console.log(err)
    })
}
run()
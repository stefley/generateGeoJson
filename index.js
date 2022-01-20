const path = require("path");
const fs = require("fs");
const axios = require("axios");
const createConfig = require("./createConfig");

let config
let imports = "";
const codemapjson = {};
const treecodemap = {};
const fetchFn = async (code, dirPath, hasChildren = true) => {
  const url = `https://geo.datav.aliyun.com/areas_v3/bound/${code}${
    hasChildren ? "_full" : ""
  }.json`;
  try {
    const { data } = await axios.get(url);
    fs.writeFile(`${dirPath}/${code}.json`, JSON.stringify(data), (err) => {
      if (err) {
        console.log(`${code}.json 文件写入失败: ${err}`);
      }
      console.log(`${code}.json 文件写入成功`);
    });
    const { features } = data;
    if (features[0]["properties"]["adcode"] !== code) {
      features.forEach((feature) => {
        const {
          adcode: _code,
          childrenNum: _hasChildren,
          name: _name,
        } = feature.properties;
        generateJsonMap(_code, _name);
        fetchFn(_code, dirPath, _hasChildren);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const run = async () => {
  config = await createConfig();
  imports = `import ${config.rootAreaName} from './${config.dirname}/${config.rootCode}.json'`
  codemapjson[config.rootCode] = config.rootAreaName
  treecodemap[config.rootAreaName] = config.rootCode.replace(/\"/g,"")
  const dirPath = path.resolve(__dirname, config.dirname);
  // 创建之前先检测目录是否已经存在
  try {
    fs.accessSync(dirPath);
    fetchFn(config.rootCode, dirPath);
  } catch (error) {
    // 不存在则创建
    fs.mkdirSync(dirPath);
    fetchFn(config.rootCode, dirPath);
  }
};

const generateJsonMap = (code, name) => {
  imports += `\n import ${name} from './${config.dirname}/${code}.json'`;
  codemapjson[code] = name;
  treecodemap[name] = code;
  const content =
    imports +
    "\n\n\n\n" +
    `export const codemapjson = ${JSON.stringify(codemapjson).replace(/\"/g, "")}` +
    "\n\n\n\n" +
    `export const treecodemap = ${JSON.stringify(treecodemap)}`;
  fs.writeFile(path.resolve(__dirname, "codemapjson.js"), content, (err) => {
    if (err) console.log(err);
  });
};

run();

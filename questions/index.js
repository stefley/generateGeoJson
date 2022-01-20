exports.dirNameQuestion = () => ({
    type: 'input',
    name: 'dirName',
    default: 'json',
    message: '输入存放地图数据目录名称'
})

exports.rootCodeQuestion = () => ({
    type: 'input',
    name: 'rootCode',
    default: '100000',
    message: '输入需要获取地图数据的adcode'
})

exports.rootAreaNameQuestion = () => ({
    type: 'input',
    name: 'rootAreaName',
    defalut: '中国',
    message: '输入需要获取地图数据的行政名称（如陕西省）'
})
const inquirer = require('inquirer')
const { dirNameQuestion, rootCodeQuestion, rootAreaNameQuestion } = require('./questions')
module.exports = async () => {
    const answer = await inquirer
        .prompt([
            dirNameQuestion(),
            rootCodeQuestion(),
            rootAreaNameQuestion(), 
        ])
    
    return {
        dirname: answer.dirName.trim(),
        rootCode: answer.rootCode.trim(),
        rootAreaName: answer.rootAreaName.trim(),
    }
} 
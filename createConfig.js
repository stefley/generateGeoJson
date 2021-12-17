const inquirer = require('inquirer')
const { dirNameQuestion, rootCodeQuestion } = require('./questions')
module.exports = async () => {
    const answer = await inquirer
        .prompt([
            dirNameQuestion(),
            rootCodeQuestion()
        ])
    
    return {
        dirname: answer.dirName.trim(),
        rootCode: answer.rootCode.trim()
    }
} 
const fs = require('fs');
const path = require('path');
import * as request from 'superagent';//引用声明
import handAnalyzer from './handAnalyzer'

export interface Analyzer {
    analyze:(html:string,filePath:string) => string;
}
class Crowller {
    private filePath = path.resolve(__dirname, '../data/course.json')
    writeFile(content: string) {
        fs.writeFileSync(this.filePath, content);
    }
    async getRawHtml() {
        return new Promise<string>((resolve, reject) => {
            request.get(this.url)
                .end(function (err, res) {
                    resolve(res.text)
                })
        })
    }
    async init() {
        const html = await this.getRawHtml();
        const analyzerCont = analyzer.analyze(html,this.filePath)
        fs.writeFileSync(this.filePath, analyzerCont);
    }
    constructor(private url: string,private analyzer:Analyzer) {
        this.init()
    }
}

const url = `https://www.jianshu.com/`;
const analyzer = new handAnalyzer();

new Crowller(url,analyzer)
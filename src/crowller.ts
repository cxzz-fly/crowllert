
const fs = require('fs');
const path = require('path');
import * as request from 'superagent';//引用声明
import * as cheerio from 'cheerio'

interface Course {
    title:string,
    abstract:string,
    lick:string,
}

interface CourseInfo {
    time:number,
    data:Course[]
}

interface Content {
    [propName: number] : Course[]
}

class Crowller {
    private url = `https://www.jianshu.com/`
    async getRawHtml(){
        return new Promise<string>((resolve,reject)=>{
            request.get(this.url)
            .end(function(err, res){
                resolve(res.text)
            })
        })
    }
    clearBr(key:string) { 
        key = key.replace(/<\/?.+?>/g,""); 
        key = key.replace(/[\r\n]/g, ""); 
        return key; 
    }    
    getCourseInfo(html:string){
        const $ = cheerio.load(html);
        const courseItems = $('.note-list li');
        let courseInfos:Course[] = [];
        courseItems.map((index,element)=>{
            const title = $(element).find('.title').text();
            const abstract = $(element).find('.abstract').text();
            const lick = $(element).find('.meta').find('span').eq(1).text();
            let ract = abstract.replace(/[\r\n]/g,"").replace(/\ +/g,""); 
            courseInfos.push({
                title,
                abstract:ract,
                lick
            })
        })
        const result = {
            time: new Date().getTime(),
            data: courseInfos
          };
        return result
    }
    generateJsonContent(courseInfo:CourseInfo){
        const filePath = path.resolve(__dirname,'../data/course.json')
        let fileContent:Content = {}
        if(fs.existsSync(filePath)){
            fileContent = JSON.parse(fs.readFileSync(filePath,'utf-8'))
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent
    }
    async init(){
        const filePath = path.resolve(__dirname, '../data/course.json');
        const htmlData:string = await this.getRawHtml()
        const courseInfo = this.getCourseInfo(htmlData)
        const fileContent = this.generateJsonContent(courseInfo)
        fs.writeFileSync(filePath, JSON.stringify(fileContent));
    }
    constructor(){
        this.init()
    }
}
const crowller = new Crowller()
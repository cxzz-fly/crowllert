

import * as cheerio from 'cheerio'
const fs = require('fs');
import { Analyzer } from './crowller'

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

export default class handAnalyzer implements Analyzer {
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
    
    generateJsonContent(filePath:string,courseInfo:CourseInfo){
        let fileContent:Content = {}
        let a:Content = {}
        if(fs.existsSync(filePath)){
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent
    }
    public analyze(html:string,filePath:string){
        const courseInfo = this.getCourseInfo(html);
        const cont = this.generateJsonContent(filePath,courseInfo)
        return JSON.stringify(cont);
    }
}


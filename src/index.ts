import fs from 'fs';

type GlobalType = {
    [key: string]: any
}

interface Global {
    essential: GlobalType    
}

declare var global: Global;

type PreviousLogs = {
    [key: string]: any
};

export default class Logger{
    private _previousLogs: PreviousLogs;
    private _filePath: string;

    constructor(filePath:string){
        if(!global.essential){
            global.essential = {}
        }   else if(global.essential["logger"]){
            throw new Error("A previous logger was detected!");
        };
        global.essential["logger"] = this;

        fs.writeFileSync(filePath, "[\n]");

        if(global.essential["terminal"])    global.essential["terminal"].log = (key:string, value:any)=>{
            this.log(key, value)
        };
        
        this._previousLogs = {};
        this._filePath = filePath;
    }
    log(key:string, value:any){
        const fd = fs.openSync(this._filePath, 'r+');

        const stats = fs.fstatSync(fd);
        const endOfFile = stats.size;
        fs.ftruncateSync(fd, endOfFile - 1);

        const buffer = Buffer.alloc(1);
        fs.readSync(fd, buffer, 0, 1, endOfFile - 3);
        const lastChar = buffer.toString() + ""
        
        this._previousLogs[key] = value;
        const appendString = JSON.stringify(this._previousLogs) + "\n]";
        
        if(lastChar !== "["){
            fs.writeSync(fd, ",", endOfFile - 1, 'utf-8')
            fs.writeSync(fd, appendString, endOfFile, 'utf-8')
        }   else{
            fs.writeSync(fd, " " + appendString, endOfFile - 1, 'utf-8')
        };

        fs.closeSync(fd);
    };
};
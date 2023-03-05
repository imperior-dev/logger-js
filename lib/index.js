"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Logger {
    constructor(filePath) {
        if (!global.essential) {
            global.essential = {};
        }
        else if (global.essential["logger"]) {
            throw new Error("A previous logger was detected!");
        }
        ;
        global.essential["logger"] = this;
        fs_1.default.writeFileSync(filePath, "[\n]");
        if (global.essential["terminal"])
            global.essential["terminal"].log = (key, value) => {
                this.log(key, value);
            };
        this._previousLogs = {};
        this._filePath = filePath;
    }
    log(key, value) {
        const fd = fs_1.default.openSync(this._filePath, 'r+');
        const stats = fs_1.default.fstatSync(fd);
        const endOfFile = stats.size;
        fs_1.default.ftruncateSync(fd, endOfFile - 1);
        const buffer = Buffer.alloc(1);
        fs_1.default.readSync(fd, buffer, 0, 1, endOfFile - 3);
        const lastChar = buffer.toString() + "";
        this._previousLogs[key] = value;
        const appendString = JSON.stringify(this._previousLogs) + "\n]";
        if (lastChar !== "[") {
            fs_1.default.writeSync(fd, ",", endOfFile - 1, 'utf-8');
            fs_1.default.writeSync(fd, appendString, endOfFile, 'utf-8');
        }
        else {
            fs_1.default.writeSync(fd, " " + appendString, endOfFile - 1, 'utf-8');
        }
        ;
        fs_1.default.closeSync(fd);
    }
    ;
}
exports.default = Logger;
;
//# sourceMappingURL=index.js.map
import * as fs from 'fs';
import * as path from 'path';
import { IProfile } from '../model/profile.model';

export class ProfileRepositery {
    filename: string = "datastore.json";
    filePath: string = path.resolve(__dirname, "..", "datastore/" + this.filename);
    dirPath: string = path.resolve(__dirname, "..", "datastore")

    private static instance: any;
    constructor() { }

    public static getInstance() {
        if (!ProfileRepositery.instance) {
            ProfileRepositery.instance = new ProfileRepositery()
            this.instance.syncFile();
        }
        return ProfileRepositery.instance;
    }

    syncFile() {
        try {
            fs.access(this.dirPath, (error) => {
                if (error && error.code === 'ENOENT') {
                    console.log(this.dirPath, 'directory created')
                    fs.mkdirSync(this.dirPath);
                    if (fs.existsSync(this.filePath)) {
                        console.log(this.filePath, 'file already exists')
                    }
                    else {
                        console.log(this.filePath, 'file created')
                        fs.writeFileSync(this.filePath, '[]')
                    }
                }
                else if (error != null) {
                    console.log(this.dirPath, "dir already exists");
                }
            })
        } catch (err) {
            throw err;
        }
    }
    async createUser(param: any) {
        if (param.user !== undefined) {
            try {
                const jsonRecords = await fs.promises.readFile(this.filePath, { encoding: 'utf8' })
                const objRecord: IProfile[] = JSON.parse(jsonRecords);

                if (objRecord.some((record: any) => record.user === param.user)) {
                    return { status: false, error: "User already exists" }
                }
                else {
                    const timestamp = new Date().getTime();
                    const obj = {
                        user: param.user,
                        id: "user_" + timestamp,
                        created: timestamp,
                        updated: timestamp
                    };
                    objRecord.unshift(obj);
                    await fs.promises.writeFile(this.filePath, JSON.stringify(objRecord, null, 2))

                    return { status: true, record: obj }
                }
            }
            catch (error) {
                return { status: false, error: error }
            }
        }
        else {
            return { status: false, error: "Bad request" }
        }
    }

    async updateUser(param: any) {
        if (param.user !== undefined) {
            try {
                const jsonRecords = await fs.promises.readFile(this.filePath, { encoding: 'utf8' })
                const objRecord: IProfile[] = JSON.parse(jsonRecords);

                if (objRecord.some((record: any) => record.user === param.user)) {
                    return { status: false, error: "User already exists" }
                }
                else {
                    const timestamp = new Date().getTime();
                    let index = objRecord.findIndex((record: any) => record.id === param.id);
                    objRecord[index].update = timestamp;
                    objRecord[index].user = param.user;
                    await fs.promises.writeFile(this.filePath, JSON.stringify(objRecord, null, 2))

                    return { status: true, record: param }
                }
            }
            catch (error) {
                return { status: false, error: error }
            }
        }
        else {
            return { status: false, error: "Bad request" }
        }

    }


    async deleteRecord(param: any) {
        console.log(param);
        if (param.user !== undefined) {
            try {
                const jsonRecords = await fs.promises.readFile(this.filePath, { encoding: 'utf8' })
                const objRecord: IProfile[] = JSON.parse(jsonRecords)
                let index = 0;
                if (objRecord.some((record: any, i) => { index = i; return record.id === param.id })) {
                    objRecord.splice(index, 1);
                    await fs.promises.writeFile(this.filePath, JSON.stringify(objRecord, null, 2))

                    return { status: true, record: param }
                }
                else {
                    return { status: false, error: "No User Found" }
                }

            }
            catch (error) {
                return { status: false, error: error }
            }
        }
        else{
            return { status: false, error: "Bad Request" }
        }
    }

    async getAllRecords() {
        try {
            const jsonRecords = await fs.promises.readFile(this.filePath, { encoding: 'utf8' })

            const objRecord: IProfile[] = JSON.parse(jsonRecords)

            return { status: true, record: objRecord }
        }
        catch (error) {
            return { status: false, error: error }
        }
    }
}




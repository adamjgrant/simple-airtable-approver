export class ObjectArrayFromTableObject {
    constructor(table_obj) {
        this.table_obj = table_obj;
        return this.objectArray;
    }

    get keys() {
        return this.table_obj[0];
    }  

    get data() {
        return this.table_obj.slice(1, this.table_obj.length);
    }

    get objectArray() {
        let array = []; 
        this.data.forEach(datum => {
            let new_obj = {}; 
            this.keys.forEach((key, index) => { 
                new_obj[key] = datum[index];
            }) 
            array.push(new_obj);
        });
        return array;
    }
}
import {Type, ObjectSchema} from "floodway";
export default class ObjectSchemaComposition{

    private groups: { [path:string]:string[] };
    private children: { [path:string]:{(): Type} };
    private count: number;

    constructor(){
        this.groups = {};
        this.count = 0;
        this.children = {};
    }

    registerChild(getSchema: {(): Type} ,key: string,groups: string[]){

        let keyI = key+":"+this.count;
        this.count++;

        this.children[keyI] = getSchema;

        for(let group of groups){

            if(this.groups[group] == null){
                this.groups[group] = [];
            }

            this.groups[group].push(keyI);

        }

    }

    makeClassName(input: string){
        return input.charAt(0)+input.slice(1);
}

    getChild(name: string): Type{
        return this.children[name]();
    }

    getGroup(name: string): ObjectSchema{
        let result: { [path:string]:Type } = {};

        if(this.groups[name] != null){

            for(let key of this.groups[name]){

                result[key.split(":")[0]] = this.getChild(key);

            }


        }else{
            throw  new Error(`Can not find the group ${name}.`);
        }

        return new ObjectSchema(this.makeClassName(name)).children(result);

    }

}
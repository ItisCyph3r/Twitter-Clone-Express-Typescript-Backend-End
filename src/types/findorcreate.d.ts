// declare module 'mongoose-findorcreate' {



//     import { Document, Model, Schema } from 'mongoose';
//     import { ObjectID } from 'bson';

//     /**
//      * Find or create mongoose static function creator
//      */

//     export type WithFindOrCreate<T extends Document> = {
//     findOrCreate: (id?: string | ObjectID | null) => T;
//     };

//     export function findOrCreateFactory<T extends Model<any>>() {
//     return async function(this: T, id?: string | ObjectID | null) {

//         if (!id || !ObjectID.isValid(id)) {
//         return new this();
//         }

//         const $id = new ObjectID(id);
//         const item = await this.findById($id);
//         return item ? item : new this();
//     };
//     }

//     export function withFindOrCreate<T extends Model<any>>(schema: Schema) {
//     schema.statics.findOrCreate = findOrCreateFactory<T>();
//     return schema;
//     }
// }
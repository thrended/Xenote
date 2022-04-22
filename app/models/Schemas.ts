import { Realm, createRealmContext } from "@realm/react";
export class Subtask extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  feature!: string;
  value!: string;
  isComplete!: boolean;
  scheduledDatetime!: Date;

  static generate(title: string, feature: string, value: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      title: title,
      feature: feature,
      value: value,
      isComplete: false,
      scheduledDatetime: new Date(),
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: "Subtask",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      title: "string",
      feature: "string",
      value: "string",
      isComplete: { type: "bool", default: false },
      scheduledDatetime: "date",
    },
  };
}

export default createRealmContext({
  schema: [Subtask],
  deleteRealmIfMigrationNeeded: true,
});

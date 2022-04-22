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

// not implemented yet
export class Note extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  body!: string;
  priority!: number;
  isFlagged!: boolean;
  // metadata
  author!: string;
  category!: string;
  dateCreated!: Date;
  dateModified!: Date;
  size!: number;

  static generate(title: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      title: title,
      body: "",
      priority: 0,
      isFlagged: false,
      author: "",
      category: "",
      dateCreated: new Date(),
      dateModified: new Date(),
      size: 0,
    };
  }

  static schema = {
    name: "Note",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      title: "string",
      body: "string",
      priority: { type: "int", default: 5 },
      isFlagged: { type: "bool", default: false },
      dateCreated: { type: "date", default: new Date() },
      dateModified: "date",
      size: "int",
    },
  };

}

export default createRealmContext({
  schema: [Subtask, Note],
  deleteRealmIfMigrationNeeded: true,
});

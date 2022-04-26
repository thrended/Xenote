import {Realm, createRealmContext} from '@realm/react';
import SubtaskListDefaultText from '../components/SubtaskListDefaultText';

export class Subtask extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  feature!: string;
  value!: string;
  isComplete!: boolean;
  scheduledDatetime!: Date;

  static generate(
    title: string,
    feature: string,
    value: string,
    _scheduledDatetime: Date,
  ) {
    return {
      _id: new Realm.BSON.ObjectId(),
      title: title,
      feature: feature,
      value: value,
      isComplete: false,
      scheduledDatetime: _scheduledDatetime,
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Subtask',
    embedded: true,
    properties: {
      _id: 'objectId',
      title: 'string',
      feature: 'string',
      value: 'string',
      isComplete: {type: 'bool', default: false},
      scheduledDatetime: 'date',
    },
  };
}

export class Reminder extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  subtasks!: Subtask[];
  isComplete!: boolean;
  scheduledDatetime!: Date;

  static generate(
    title: string,
    _scheduledDatetime: Date,
    subtasks?: Subtask[],
  ) {
    return {
      _id: new Realm.BSON.ObjectId(),
      title: title,
      subtasks: subtasks? subtasks: new Array<Subtask>(),
      isComplete: false,
      scheduledDatetime: _scheduledDatetime,
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Reminder',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      subtasks: {type: 'list', objectType: 'Subtask'},
      isComplete: {type: 'bool', default: false},
      scheduledDatetime: 'date',
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

  static generate(title: string, author: string, body: string, date: Date, prio: number) {
    return {
      _id: new Realm.BSON.ObjectId(),
      title: title,
      body: body,
      priority: prio,
      isFlagged: false,
      author: author,
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
  schema: [Reminder, Subtask, Note],
  deleteRealmIfMigrationNeeded: true,
});

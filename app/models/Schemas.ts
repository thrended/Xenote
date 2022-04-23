import {Realm, createRealmContext} from '@realm/react';
import SubtaskListDefaultText from '../components/SubtaskListDefaultText';

export class Subtask extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  feature!: string;
  value!: string;
  isComplete!: boolean;
  scheduledDatetime!: Date;

  static generate(title: string, feature: string, value: string, _scheduledDatetime: Date) {
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

  static generate(title: string, subtasks?: Subtask[]) {
    return {
      _id: new Realm.BSON.ObjectId(),
      title: title,
      subtasks: subtasks? subtasks: new Array<Subtask>(),
      isComplete: false,
      scheduledDatetime: new Date(),
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Reminder',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      subtasks: { type: "list", objectType: "Subtask" },
      isComplete: {type: 'bool', default: false},
      scheduledDatetime: 'date',
    },
  };
}

export default createRealmContext({
  schema: [Reminder, Subtask],
  deleteRealmIfMigrationNeeded: true,
});

import mem from 'mem';
import { MongoClient, ObjectId } from 'mongodb';
import config from './config';
import { system } from './logger';


function getQuery(id: ?string, query: Object = {}) {
  return id ? { _id: ObjectId(id), ...query } : query;
}

class Datastore {
  constructor() {
    this.type = config.datastore.type;
    this.getDB = mem(() => this.connect(config.datastore.url));
    this.getDB();
  }

  async connect(url: string) {
    const db = await MongoClient.connect(url);
    system.info('Datastore connected');
    return db;
  }
  async collection(name: string) {
    const db = await this.getDB();
    return db.collection(name);
  }

  async findOne(collection: string, id: ?string, query: Object = {}) {
    const col = await this.collection(collection);
    const result = await col.findOne(getQuery(id, query));
    return result;
  }
  async fundArray(collection: string, query: Object = {}) {
    const col = await this.collection(collection);
    const result = await col.find(getQuery(null, query)).toArray();
    return result;
  }
  async insert(collection: string, value: string) {
    const col = await this.collection(collection);
    const { insertedId } = await col.insertOne(value);
    return insertedId.toString();
  }
  async updateOne(collection: string, id: ?string, query: Object, value: string) {
    const col = await this.collection(collection);
    await col.updateOne(getQuery(id, query), value);
  }
  async remove(collection: string, id: ?string, query: Object) {
    const col = await this.collection(collection);
    await col.remove(getQuery(id, query));
  }

  async findArray(name: string, query: Object) {
    const collection = await this.collection(name);
    const result = await collection.find(query).toArray();
    return result;
  }
}

export default new Datastore();

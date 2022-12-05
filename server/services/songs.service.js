const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");

const path = require("path");

class SongService {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_SONGS);
  }

  async getAllSongs () {
    return this.collection.find().toArray();
  }

  async getSongById (id) {
    const songs = this.getAllSongs();
    const song = (await songs).find((song) => song.id === id);
    return song;
  }

  async updateSongLike (id) {
    const song = await this.getSongById(id);
    const newState = !song.liked;
    this.collection.updateOne({ _id: song._id }, { $set: { liked: newState } });
    return newState;
  }

  async search (substring, exact) {
    let filter = {};
    if (exact) {
      filter = {
        $or: [{ name: { $regex: `${substring}` } },
          { artist: { $regex: `${substring}` } },
          { genre: { $regex: `${substring}` } }]
      };
    } else {
      filter = {
        $or: [{ name: { $regex: `${substring}`, $options: "i" } },
          { artist: { $regex: `${substring}`, $options: "i" } },
          { genre: { $regex: `${substring}`, $options: "i" } }]
      };
    }
    const songs = await this.collection.find(filter).toArray();
    return songs;
  }

  async populateDb () {
    const songs = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).songs;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_SONGS, songs);
    return songs;
  }
}

module.exports = { SongService };

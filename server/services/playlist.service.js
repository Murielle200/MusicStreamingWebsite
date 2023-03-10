const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");
const path = require("path");
const { randomUUID } = require("crypto");
const fs = require("fs");

class PlaylistService {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/playlists.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_PLAYLISTS);
  }

  async getAllPlaylists () {
    return this.collection.find().toArray();
  }

  async getPlaylistById (id) {
    const allPlaylists = await this.getAllPlaylists();
    const playlist = allPlaylists.find((playlist) => playlist.id === id);
    if (playlist === undefined) {
      return null;
    }
    return playlist;
  }

  async addPlaylist (playlist) {
    playlist.id = randomUUID();
    await this.savePlaylistThumbnail(playlist);
    this.collection.insertOne(playlist);
    return playlist;
  }

  async updatePlaylist (playlist) {
    delete playlist._id;
    await this.savePlaylistThumbnail(playlist);
    await this.collection.findOneAndReplace({ id: playlist.id }, playlist);
  }

  /**
   * Extrait le type d'image d'une notation base64 d'une image
   * @param {string} picture image représentée sous le format base64
   * @returns {string} le type de l'image
   */
  async chooseProperEncoding (picture) {
    if (picture.startsWith("data:image/jpeg;base64,")) {
      return "jpeg";
    } else if (picture.startsWith("data:image/png;base64,")) {
      return "png";
    } else if (picture.startsWith("data:image/bmp;base64,")) {
      return "bmp";
    } else if (picture.startsWith("data:image/jpg;base64,")) {
      return "jpg";
    } else {
      throw new Error("Invalid image format");
    }
  }

  /**
   * @param {string} id identifiant de la playlist
   * @returns {Promise<boolean>} true si la playlist a été supprimée, false sinon
   */
  async deletePlaylist (id) {
    const res = await this.collection.findOneAndDelete({ id });
    if (res.value) {
      const tnail = res.value.thumbnail;
      await this.deletePlaylistThumbnail(tnail);
    }
    return res.value !== null;
  }

  /**
   * Supprime un fichier sur disque
   * @param {string} filePath chemin vers le fichier à supprimer
   * @returns {Promise<void>} une promesse avec 'undefined' en cas de réussite
   */
  async deletePlaylistThumbnail (filePath) {
    return fs.promises.unlink(filePath);
  }

  /**
   * Sauvegarde l'image de prévisualisation d'une playlist sur disque
   * @param {Object} playlist playlist pour laquelle sauvegarder l'image
   */
  async savePlaylistThumbnail (playlist) {
    const fileFormat = await this.chooseProperEncoding(playlist.thumbnail);
    const thumbnailData = playlist.thumbnail.replace(`data:image/${fileFormat};base64,`, "");
    const thumbnailFileName = `assets/img/${playlist.id}.${fileFormat}`;
    const filePath = path.join(__dirname + `../../assets/img/${playlist.id}.${fileFormat}`);
    await fs.promises.writeFile(filePath, thumbnailData, { encoding: "base64" });
    playlist.thumbnail = thumbnailFileName;
  }

  async search (substring, exact) {
    let filter = {};
    if (exact) {
      filter = { $or: [{ name: { $regex: `${substring}` } }, { description: { $regex: `${substring}` } }] };
    } else {
      filter = { $or: [{ name: { $regex: `${substring}`, $options: "i" } }, { description: { $regex: `${substring}`, $options: "i" } }] };
    }
    const playlists = await this.collection.find(filter).toArray();
    return playlists;
  }

  async populateDb () {
    const playlists = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).playlists;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_PLAYLISTS, playlists);
  }
}
module.exports = { PlaylistService };

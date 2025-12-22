import { Player } from "@prisma/client";
import { PlayerRepository } from "../infrastructure/database/repositories/players";
import { Static } from "@sinclair/typebox";
import { PlayerValidation } from "../domain/validations/player";
import checkData from "../domain/validations";




export class PlayerService {
  private playerRepository: PlayerRepository;

  constructor(playerRepository: PlayerRepository) {
    this.playerRepository = playerRepository;
  }

  async getAllPlayers() {
    return await this.playerRepository.findAll();
  }

  async getPlayer(id: PlayerId) {
    return await this.playerRepository.find(id);
  }

  async createPlayer(data: PlayerAttributes) {
    checkData(PlayerValidation, data);
    return await this.playerRepository.create(data);
  }

  async updatePlayer(id: PlayerId, data: PlayerAttributes) {
    checkData(PlayerValidation, data);
    return await this.playerRepository.update(id, data);
  }

  async deletePlayer(id: PlayerId) {
    return await this.playerRepository.delete(id);
  }
}
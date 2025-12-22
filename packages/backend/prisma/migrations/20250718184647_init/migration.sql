-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING_FOR_USERS', 'STARTED', 'ENDED');

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "GameStatus" NOT NULL DEFAULT 'WAITING_FOR_USERS',
    "currentGameUserId" UUID,
    "userCount" SMALLINT NOT NULL,
    "tileBag" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gameId" UUID NOT NULL,
    "userId" UUID,
    "userIndex" SMALLINT NOT NULL,
    "score" SMALLINT NOT NULL DEFAULT 0,
    "tiles" TEXT NOT NULL,
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_users_gameId_userIndex_key" ON "game_users"("gameId", "userIndex");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_currentGameUserId_fkey" FOREIGN KEY ("currentGameUserId") REFERENCES "game_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_users" ADD CONSTRAINT "game_users_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "games" (
    "id" BIGSERIAL NOT NULL,
    "isGameOver" BOOLEAN NOT NULL DEFAULT false,
    "currentGameUserIndex" SMALLINT NOT NULL DEFAULT 0,
    "userCount" SMALLINT NOT NULL,
    "tileBag" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_users" (
    "gameId" BIGINT NOT NULL,
    "userId" UUID NOT NULL,
    "index" SMALLINT NOT NULL,
    "score" SMALLINT NOT NULL DEFAULT 0,
    "tiles" TEXT NOT NULL,
    "accepted" BOOLEAN
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_friends" (
    "userId" UUID NOT NULL,
    "friendId" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "game_users_gameId_idx" ON "game_users"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "game_users_gameId_index_key" ON "game_users"("gameId", "index");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_friends_userId_friendId_idx" ON "users_friends"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "users_friends_userId_friendId_key" ON "users_friends"("userId", "friendId");

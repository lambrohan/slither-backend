-- CreateEnum
CREATE TYPE "TxnType" AS ENUM ('DEPOSIT', 'EARNING', 'STAKE', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('RED', 'BLUE', 'GREEN', 'COIN', 'ORANGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "public_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TxnType" NOT NULL,
    "hash" TEXT,
    "deposit_id" TEXT,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "tokens_earned" BIGINT NOT NULL DEFAULT 0,
    "tokens_staked" BIGINT NOT NULL,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "won" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "snake_length" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "nickname" TEXT,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRoom" (
    "id" TEXT NOT NULL,
    "min_usd_to_join" DOUBLE PRECISION NOT NULL,
    "max_usd_to_join" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "variable_stake" BOOLEAN NOT NULL DEFAULT false,
    "max_players" INTEGER NOT NULL DEFAULT 0,
    "tokens" BIGINT NOT NULL DEFAULT 0,
    "tokens_per_instance" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "type" "FoodType" NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomInstance" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destroyed_at" TIMESTAMP(3),
    "tokens" BIGINT NOT NULL,
    "colyseus_room_id" TEXT NOT NULL,

    CONSTRAINT "RoomInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_public_address_key" ON "User"("public_address");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_deposit_id_session_id_key" ON "Transaction"("hash", "deposit_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_name_key" ON "GameRoom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Food_type_key" ON "Food"("type");

-- CreateIndex
CREATE UNIQUE INDEX "RoomInstance_colyseus_room_id_key" ON "RoomInstance"("colyseus_room_id");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomInstance" ADD CONSTRAINT "RoomInstance_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

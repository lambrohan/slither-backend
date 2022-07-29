-- AlterTable
ALTER TABLE "GameRoom" ADD COLUMN     "min_kills_to_win" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "min_minutes_to_win" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "tokens" SET DEFAULT 0,
ALTER COLUMN "tokens_per_instance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "tokens_earned" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "amount" SET DEFAULT 0;

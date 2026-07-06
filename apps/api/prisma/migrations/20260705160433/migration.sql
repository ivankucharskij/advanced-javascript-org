-- AlterTable
CREATE SEQUENCE challenge_order_seq;
ALTER TABLE "Challenge" ALTER COLUMN "order" SET DEFAULT nextval('challenge_order_seq');
ALTER SEQUENCE challenge_order_seq OWNED BY "Challenge"."order";

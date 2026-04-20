/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_session_id_key" ON "feedbacks"("session_id");

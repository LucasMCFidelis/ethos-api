-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_answers" DROP CONSTRAINT "session_answers_session_id_fkey";

-- AddForeignKey
ALTER TABLE "session_answers" ADD CONSTRAINT "session_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

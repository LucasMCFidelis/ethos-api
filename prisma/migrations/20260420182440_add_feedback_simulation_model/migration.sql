-- CreateTable
CREATE TABLE "feedbacks" (
    "id" UUID NOT NULL,
    "session_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rate" SMALLINT NOT NULL,
    "use_objective" VARCHAR(100) NOT NULL,
    "suggestion" TEXT,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

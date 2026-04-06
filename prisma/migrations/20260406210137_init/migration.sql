-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "track_id" VARCHAR(50) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "result_key" VARCHAR(50),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_answers" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "question_id" VARCHAR(50) NOT NULL,
    "answer" VARCHAR(50) NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session_answers" ADD CONSTRAINT "session_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

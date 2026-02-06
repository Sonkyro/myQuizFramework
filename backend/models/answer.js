import db from "../db/db.js";

export const saveAnswers = (sessionId, participantId, scoreArray) => {
  const stmt = db.prepare(`
    INSERT INTO answers (sessionId, participantId, questionId, userAnswer, correct)
    VALUES (@sessionId, @participantId, @questionId, @userAnswer, @correct)
  `);

  const insertMany = db.transaction((answers) => {
    for (const a of answers) {
      stmt.run({
        sessionId,
        participantId,
        questionId: a.questionId,
        userAnswer: a.userAnswer,
        correct: a.correct ? 1 : 0
      });
    }
  });

  insertMany(scoreArray);
};

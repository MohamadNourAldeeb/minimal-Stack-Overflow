import Answer from "./answer.js";
import ApiError from "./api_error.model.js";
import Comment from "./comment.js";
import EditRequest from "./edit_request.js";
import LogMaliciousUser from "./log_malicious_user.model.js";
import Question from "./question.js";
import QuestionTag from "./question_tag.js";
import Tag from "./tag.js";
import User from "./user.model.js";
import UserRefreshToken from "./user_refresh_tokens.model.js";
import Vote from "./vote.js";
User.hasMany(Question, {
    foreignKey: "user_id",
    as: "created_questions",
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});

Question.belongsTo(User, {
    foreignKey: "user_id",
    as: "creator",
});

User.hasMany(Question, {
    foreignKey: "last_edited_by",
    as: "last_edited_questions",
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});

Question.belongsTo(User, {
    foreignKey: "last_edited_by",
    as: "last_editor",
});

User.hasMany(Answer, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "created_answers",
    foreignKey: "user_id",
});
Answer.belongsTo(User, {
    foreignKey: "user_id",
    as: "answer_creator",
});

Answer.belongsTo(User, {
    foreignKey: "last_edited_by",
    as: "answer_last_editor",
});
User.hasMany(Answer, {
    foreignKey: "last_edited_by",
    as: "last_edited_answers",
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});

User.hasMany(EditRequest, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "edit_requests",
    foreignKey: "user_id",
});
EditRequest.belongsTo(User, {
    as: "creator",
    foreignKey: "user_id",
});

User.hasMany(Comment, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "user_id",
});
Comment.belongsTo(User, {
    foreignKey: "user_id",
});

Question.hasMany(Answer, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "question_id",
});
Answer.belongsTo(Question, {
    foreignKey: "question_id",
});

Question.hasMany(Comment, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "question_id",
});
Comment.belongsTo(Question, {
    foreignKey: "question_id",
});

Answer.hasMany(Comment, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "answer_id",
});
Comment.belongsTo(Answer, {
    foreignKey: "answer_id",
});

User.hasMany(Vote, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "user_id",
});
Vote.belongsTo(User, {
    foreignKey: "user_id",
});

Question.hasMany(Vote, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "question_id",
});
Vote.belongsTo(Question, {
    foreignKey: "question_id",
});

Answer.hasMany(Vote, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "answer_id",
});
Vote.belongsTo(Answer, {
    foreignKey: "answer_id",
});

User.hasMany(UserRefreshToken, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "user_id",
});
UserRefreshToken.belongsTo(User, {
    foreignKey: "user_id",
});

User.hasMany(ApiError, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "user_id",
});
ApiError.belongsTo(User, {
    foreignKey: "user_id",
});

Tag.hasMany(QuestionTag, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "tag_id",
});
QuestionTag.belongsTo(Tag, {
    foreignKey: "tag_id",
});

Question.hasMany(QuestionTag, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "question_id",
});
QuestionTag.belongsTo(Question, {
    foreignKey: "question_id",
});

Question.hasMany(EditRequest, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "question_id",
});
EditRequest.belongsTo(Question, {
    foreignKey: "question_id",
});

Answer.hasMany(EditRequest, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "answer_id",
});
EditRequest.belongsTo(Answer, {
    foreignKey: "answer_id",
});
// -------------------------------------------------------------------
export {
    User,
    ApiError,
    UserRefreshToken,
    Question,
    QuestionTag,
    Answer,
    EditRequest,
    Comment,
    Vote,
    Tag,
    LogMaliciousUser,
};

export let enumTypeInput = {
    body: "body", //body filed
    query: "query", //query parameters
    params: "params", ///path parameters
};

export const imageStatus = { edit: "edit", same: "same" };
export const enumTypeError = { frontend: "frontend", backend: "backend" };
export const enumUploadType = {
    image: "image",
    file: "file",
};
export const enumTypePermission = {
    include: "include",
    exclude: "exclude",
};

export const enumStateOfEmail = {
    un_verified: "un_verified",
    verified: "verified",
    blocked: "blocked",
};
export const enumStateOfEditRequest = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
};
export const enumStateOfVoting = {
    upVote: "upVote",
    downVote: "downVote",
};
export const enumTypeOtp = {
    verify: "verify",
    reset_pass: "reset_pass",
};

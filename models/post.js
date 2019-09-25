import mongoose from "mongodb";

const postSchema = new mongoose.Schema({
  post: {
    id: { type: "String", required: true },
    title: { type: "String", required: true },
    body: { type: "String, required: true " },
    createdAt: { type: "Date", default: Date.now, required: true }
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;

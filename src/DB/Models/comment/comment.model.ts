import { model, Schema } from "mongoose";
import { IComment } from "../../../common";

const schema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],

    content: String,
    attachment: String,
    reactionsCount: {type:Number , default:0},
  },
  { timestamps: true },
);

schema.pre("deleteOne", async function () {
  console.log(this); // query
  let filter = this.getFilter(); // {_id:parentId}

  // find all replies
  const replies = await this.model.find({ parentId: filter._id }); // [{},{},{}] | []

  // if replies >> loop deleteOne
  if (replies.length > 0) {
    for (const reply of replies) {
      await this.model.deleteOne({ _id: reply._id });
    }
  }
  // next()
});

export const Comment = model<IComment>("Comment", schema);
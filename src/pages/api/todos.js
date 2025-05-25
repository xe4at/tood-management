import connectDB from "../../../utils/connectDB";
import { getToken } from "next-auth/jwt";
import User from "../../../models/User";
import { sortTodos } from "../../../utils/sortTodos";

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req, res) {
  try {
    await connectDB();

    const token = await getToken({ req, secret });

    if (!token) {
      return res
        .status(401)
        .json({ status: "failed", message: "You are not logged in!" });
    }

    const user = await User.findOne({ email: token.user.email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User doesn't exist!" });
    }

    if (req.method === "POST") {
      const { title, status } = req.body;

      if (!title || !status) {
        return res
          .status(422)
          .json({ status: "failed", message: "Invalid data!" });
      }

      // اینجا می‌تونی اعتبارسنجی مقدار status هم اضافه کنی

      user.todos.push({ title, status });
      await user.save();

      return res
        .status(201)
        .json({ status: "success", message: "Todo created!" });
    } else if (req.method === "GET") {
      const sortedData = sortTodos(user.todos);
      return res
        .status(200)
        .json({ status: "success", data: { todos: sortedData } });
    } else if (req.method === "PATCH") {
      const { id, status } = req.body;

      if (!id || !status) {
        return res
          .status(422)
          .json({ status: "failed", message: "Invalid data!" });
      }

      const result = await User.updateOne(
        { "todos._id": id },
        { $set: { "todos.$.status": status } }
      );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ status: "failed", message: "Todo not found!" });
      }

      return res.status(200).json({ status: "success" });
    } else {
      return res
        .status(405)
        .json({ status: "failed", message: "Method not allowed!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: error.message || "Server error" });
  }
}

export default handler;

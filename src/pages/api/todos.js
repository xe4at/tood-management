import connectDB from "../../../utils/connectDB";
import { getToken } from "next-auth/jwt";
import User from "../../../models/User";

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Error in connecting to DB",
    });
  }

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

    user.todos.push({ title, status });
    await user.save();

    return res
      .status(201)
      .json({ status: "success", message: "Todo created!" });
  }

  res.status(405).json({ status: "failed", message: "Method not allowed!" });
}

export default handler;

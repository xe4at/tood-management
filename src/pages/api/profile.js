import { getToken } from "next-auth/jwt";
import User from "../../../models/User";
import { verifyPassword } from "../../../utils/auth";
import connectDB from "../../../utils/connectDB";

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "failed", message: "Error in connecting to DB" });
  }

  const token = await getToken({ req, secret });
  console.log("token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ status: "failed", message: "You are not logged in" });
  }

  const user = await User.findOne({ email: token.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "User doesn't exist!" });
  }

  if (req.method === "POST") {
    const { name, lastName, password } = req.body;

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(422).json({
        status: "failed",
        message: "password is incorrect!",
      });
    }

    user.name = name;
    user.lastName = lastName;
    await user.save();

    res.status(200).json({
      status: "success",
      data: { name, lastName, email: user.email },
    });
  } else {
    res.status(405).json({ status: "failed", message: "Method not allowed" });
  }
}

export default handler;

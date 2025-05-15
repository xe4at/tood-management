import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="signin-form">
      <h3>Login Form</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
      <div>
        <p>Create an account?</p>
        <Link href="/signup">Sign up</Link>
      </div>
    </div>
  );
}

export default SigninPage;

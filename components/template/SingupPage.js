import Link from "next/link";

function SingupPage() {
  return (
    <div className="signin-form">
      <h3>Registration Form</h3>
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Register</button>
      <div>
        <p>Have an account?</p>
        <Link href="/singin">Sign in</Link>
      </div>
    </div>
  );
}

export default SingupPage;

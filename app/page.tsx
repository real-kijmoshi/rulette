import Link from "next/link";

export default function Page() {
    //landing page
    return (
        <div>
            <h1>Home Page</h1>
            <p>Click <Link href="/api/auth/signin">here</Link> to sign in.</p>
        </div>
    );
}
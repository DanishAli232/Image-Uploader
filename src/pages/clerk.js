import React from "react";
import "./App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";

const clerkPubKey = "pk_test_c2hhcmluZy1ha2l0YS0xOC5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <Welcome />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

function Welcome() {
  return <div>Hello you are signed in</div>;
}

export default App;

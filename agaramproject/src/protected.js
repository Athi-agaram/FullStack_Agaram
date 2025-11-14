import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decrypt } from "./encrypt";

function ProtectedRoute({ children }) {
  const sessionData = Cookies.get("sessionToken");

  if (!sessionData) 
   <Navigate to="/LoginPage" />;

  try {
    const { username, password } = JSON.parse(sessionData);

    const decryptedUser = decrypt(username);
    const decryptedPass = decrypt(password);

    if (decryptedUser === "user" && decryptedPass === "pass") {
      return children;
    } else {
      return <Navigate to="/LoginPage" />;
    }
  } catch (err) {
    console.error("Invalid session data:", err);
    return <Navigate to="/LoginPage" />;
  }
}

export default ProtectedRoute;


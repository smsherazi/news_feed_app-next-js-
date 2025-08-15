import React, { useState } from "react";
import "@/Component Css/modal.css";
import { RiLockPasswordFill, RiProfileFill } from "react-icons/ri";
export default function Modal({ mode, onClose, user, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("!");
  const [loader, setLoader] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (mode === "password") {
      if (oldPassword === "" || password === "" || confirmPassword === "") {
        setError("All Fields Are Required!");
        setLoader(false);
        return;
      } else if (password.length < 8 || oldPassword.length < 8) {
        setError("Password at least 8 characters!");
        setLoader(false);
        return;
      } else if (password !== confirmPassword) {
        setError("Confirm Password Does'nt Match!");
        setLoader(false);
        return;
      }

      const payload = { oldPassword, password };

      await onSave(payload);
      setLoader(false);
    }
    if (mode === "edit") {
      if (name === "" || email === "") {
        setError("All Fields Are Required!");
        setLoader(false);
        return;
      } else if (!emailRegex.test(email)) {
        setError("Invalid email format @ Required!");
        setLoader(false);
        return;
      }

      const payload = { name, email };

      await onSave(payload);
      setLoader(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>
          {mode === "edit" ? (
            <>
              Edit Credentials{" "}
              <i>
                <RiProfileFill />
              </i>
            </>
          ) : (
            <>
              Change Password{" "}
              <i>
                <RiLockPasswordFill />
              </i>
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit}>
          {mode === "edit" && (
            <>
              {/* <label>Name</label> */}
              <input
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setError("!");
                  setName(e.target.value);
                }}
                onKeyDown={(e) => {
                  const key = e.key;
                  const cursorPosition = e.target.selectionStart;
                  if (
                    (!/^[a-zA-Z\s]$/.test(key) &&
                      key !== "Backspace" &&
                      key !== "Tab" &&
                      key !== "ArrowLeft" &&
                      key !== "ArrowRight") ||
                    (key === " " && cursorPosition === 0)
                  ) {
                    e.preventDefault();
                  }
                }}
              />

              {/* <label>Email</label> */}
              <input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => {
                  setError("!");
                  setEmail(e.target.value);
                }}
              />
            </>
          )}

          {mode === "password" && (
            <>
              {/* <label>Old Password</label> */}
              <input
                placeholder="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setError("!");
                  setOldPassword(e.target.value);
                }}
                // required
              />

              {/* <label>New Password</label> */}
              <input
                placeholder="New Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setError("!");
                  setPassword(e.target.value);
                }}
                // required
              />

              {/* <label>Confirm New Password</label> */}
              <input
                placeholder="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setError("!");
                  setConfirmPassword(e.target.value);
                }}
                // required
              />
            </>
          )}

          <p
            className="error"
            style={{
              visibility: error === "!" ? "hidden" : "visible",
            }}
          >
            {error}
          </p>

          <div className="btns">
            <button type="submit" className="updateBtn">
              {loader ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                "Update"
              )}
            </button>
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

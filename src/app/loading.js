
export default function Loading() {
  return (
    <div
      style={{
        background: "white",
        color: "green",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <div
        className="spinner-border text-success"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {/* <p className="mt-3 small">Fetching latest headlines...</p> */}
    </div>
  );
}

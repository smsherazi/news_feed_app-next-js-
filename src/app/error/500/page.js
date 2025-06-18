export default function Error500() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "5rem",
        color: "#fff",
        background: "#02010a",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "6rem" }} className="text-success">
        500
      </h1>
      <h2>OOPSS Connection Error!</h2>
      <p>
        Something went wrong on the server.
        <br />
        Please try again later or refresh the page.
        <br />
        We&apos;re working to fix this issue.
      </p>
    </div>
  );
}

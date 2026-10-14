import { useWindow } from "../context";

export default function PreviewApp() {
  const win = useWindow();
  const file = win?.payload?.file;

  if (!file) {
    return <div className="dt-app dt-pad dt-empty">No file selected.</div>;
  }

  if (file.type === "image") {
    return (
      <div className="dt-app dt-preview">
        <div className="dt-preview-name">{file.name}</div>
        <img className="dt-preview-img" src={file.src} alt={file.name} />
      </div>
    );
  }

  return (
    <div className="dt-app dt-preview">
      <div className="dt-preview-name">{file.name}</div>
      <pre className="dt-preview-text">{file.content}</pre>
    </div>
  );
}

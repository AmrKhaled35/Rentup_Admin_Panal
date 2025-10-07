import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({ fullDescription, setFullDescription }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={fullDescription}
      onChange={setFullDescription}
      modules={modules}
      formats={formats}
      className="h-full"
    />
  );
};

export default Editor;

import React, { useState } from "react";
import RichTextEditor from "../RichTextEditor";

const EditorContainer = () => {
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content, delta, source, editor) => {
    // Update the editor content state
    setEditorContent(content);
  };

  const handleSaveToDatabase = () => {
    // Simulate sending the image URLs to the database
    console.log("Saving to database:", editorContent);
    // Implement your backend API call here
  };

  return (
    <div>
      <RichTextEditor value={editorContent} onChange={handleEditorChange} />
      <button onClick={handleSaveToDatabase}>Save to Database</button>
    </div>
  );
};

export default EditorContainer;

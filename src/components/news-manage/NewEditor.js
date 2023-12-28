import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import style from './index.module.css'
export default function NewEditor(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())


  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState)
  }

  const handleBlur = () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    props.getEditorData(content)
  }
  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName={style.editorClassName}
      onEditorStateChange={handleEditorChange}
      onBlur={handleBlur}
    />
  )
}

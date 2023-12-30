import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import style from './index.module.css'
export default function NewEditor(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (props.editorContent) {
      const contentBlock = htmlToDraft(props.editorContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState)
      }

    }

  }, [props.editorContent])


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

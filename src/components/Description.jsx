import React from 'react'
import ReactMarkdown from "react-markdown"
import { Link } from 'react-router-dom'

export const Description = ({des}) => {
  return (
    <ReactMarkdown components={{
        a: ({href, children}) => {
            if (href?.startsWith("https://vocadb.net/Ar/")) {
                const id = href.split("/").pop()

                return (
                    <Link to={`/artist/${id}`}>
                        {children}
                    </Link>
                )
            }
        }
    }}>
        {des}
    </ReactMarkdown>
  )
}

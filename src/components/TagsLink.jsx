import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const TagsLink = ({name, id}) => {
    return (
        <Link className='text-decoration-none' to={`/tags/${id}`}>{name}</Link>
    )
}

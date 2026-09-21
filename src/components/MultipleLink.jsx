import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const MultipleLink = ({data}) => {
    return (
        <>
            {data?.map((item, index) => (
                <Fragment key={index}>
                    <Link to={`/artist/${item?.id}`} className="text-start fw-semibold text-decoration-none">{item?.defaultName}</Link>
                    {index < data?.length - 1 && ", "}
                </Fragment>
            ))}
        </>
    )
}

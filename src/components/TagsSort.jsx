import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { TagsLink } from './TagsLink'

export const TagsSort = ({data}) => {
    const groupTags = data?.reduce((groups, item) => {
        const category = item.categoryName

        if (!groups[category]) {
            groups[category] = []
        }

        groups[category].push(item)

        return groups
    }, {})

    console.log(data)

  return (
    <>
        {Object.entries(groupTags || {}).map(([category, tags]) => (
            <div key={category} className="row py-1 d-flex text-center text-lg-start mx-2">
                <div className="col-lg-4 fw-semibold">
                    {category}:
                </div>
                <div className="col-lg-8 d-flex flex-wrap justify-content-center justify-content-lg-start">
                    {tags?.map((tag, index) => (
                        <div key={tag.id} className='mx-1'>
                            <TagsLink name={tag.name} id={tag.id} />
                            {index < tags.length - 1 && ", "}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </>
  )
}

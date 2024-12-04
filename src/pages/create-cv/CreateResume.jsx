import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { TemplatesData } from '../../components/support'

const CreateResume = () => {
    return (
        <div className='tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-class tw-py-4' name="Resume page">
            <Routes>
                {TemplatesData.map(template => (
                    <Route
                        key={template?.id}
                        path={`/${template.name}`}
                        Component={template.component} />
                ))}
            </Routes>
        </div>
    )
}

export default CreateResume 
import React from 'react'
import { PuffLoader } from "react-spinners"
const MainSpinner = () => {
    return (
        <div className="tw-w-screen tw-h-screen tw-flex tw-items-center tw-justify-center">
            <PuffLoader color="#0000FF" size={80} />
        </div>
    )
}

export default MainSpinner
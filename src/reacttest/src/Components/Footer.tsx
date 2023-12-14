import React from "react";
import { format } from "date-fns";

export default function Footer(props: any) {
    return (
        <div className='bg-[#0D2E3C] py-14 px-6 text-white'>
            <svg className="w-14 h-auto block mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.51 55.61">
                <path fill="#fff" d="m39.47,55.61c-9.4-.01-17.02-7.63-17.03-17.03,0-2.99-2.42-5.41-5.41-5.41s-5.41,2.42-5.41,5.41H0c0-9.41,7.63-17.03,17.03-17.03s17.03,7.63,17.03,17.03c0,2.99,2.42,5.41,5.41,5.41s5.41-2.42,5.41-5.41c0-2.99-2.42-5.41-5.41-5.41h0v-11.62c9.41,0,17.03,7.62,17.04,17.02s-7.62,17.03-17.02,17.04h-.02Z"/>
                <circle fill="#fff" cx="5.95" cy="5.59" r="5.59"/>
                <circle fill="#fff" cx="24.17" cy="5.59" r="5.59"/>
            </svg>
            <p className='text-center mt-6'>&copy; {format(new Date(), 'yyyy')} teconet Corp. all rights reserved.</p>
        </div>
    )
}
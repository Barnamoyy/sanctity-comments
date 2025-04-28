import React from "react";

// components
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";


const dashboardLayout = ({children}:{children: React.ReactNode}) => {
    return (
        <div className="w-screen h-screen">
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-4">
                <div className="hidden lg:flex flex-col justify-start items-end gap-y-2 lg:gap-y-4 px-2 py-4 lg:px-4">
                    <UserButton />
                    <ModeToggle />
                </div>
                <div className="border-[0.5px] border-slate-200 dark:border-slate-800 col-span-2">
                {children}
                </div>
                <div className="hidden lg:flex"></div>
            </div>
        </div>
    );
}

export default dashboardLayout;
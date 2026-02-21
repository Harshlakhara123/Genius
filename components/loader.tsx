import { LoaderIcon } from "lucide-react";

export const Loader = () => {
    return (
        <div className="h-full flex flex-col gap-y-4 items-center justify-center">
            <div className="w-10 h-10 relative">
                <LoaderIcon
                    className="animate-spin"
                />
            </div>
            <p>
                Genius is thinking...
            </p>
        </div>
    )
};
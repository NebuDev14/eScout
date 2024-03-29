import React from "react";

export const Container: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    return (
        <div className="grid grid-cols-2">
            {children}
        </div>
    );
}

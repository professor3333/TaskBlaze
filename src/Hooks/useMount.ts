import { useEffect } from "react";

const useMount = (func: () => void) => {
    useEffect(() => {
        func();
    }, []);
};

export default useMount;
import { useParams } from "next/navigation"

export const useGetOrigin=()=>{
    const params = useParams();
    return params.origin as string;
}
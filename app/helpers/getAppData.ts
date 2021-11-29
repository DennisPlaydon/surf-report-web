import useSWR from "swr";
import { beaches } from "../beaches";

export function getAppData() {
    const urls = beaches.map((beach) => `/api/metservice/${beach.name}`);
    const { data, error } = useSWR(urls, fetcher);

    return {
        rawData: data,
        isLoading: !error && !data,
        isError: error,
    };
}

function fetcher(...urls: string[]) {
    const f = (u: string) => fetch(u).then((r) => r.json());

    return Promise.all(urls.map(f));
}

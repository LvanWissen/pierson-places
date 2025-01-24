export const ssr = false;

import type { PageLoad } from "./$types";


interface MapData {
    id: number;
    metadata: MetaData;
    iiifInfoUrl: string;
    partOf: number;
    isGeoreferenced: number;
    isValidated: number;
    canvasId: string;
    manifestId: string;
    isNotAMap: number;
}

interface MetaData {
    title: string;
    description: string;
    date: string;
    creator: string;
    subject: string;
    type: string;
    format: string;
    identifier: string;
    source: string;
}

export const load: PageLoad = async ({ params }) => {

    const { item_id } = params;

    const res = await fetch(`https://lvanwissen-piersonplaces.web.val.run/item/${item_id}`);

    const data: MapData = await res.json();

    console.log(data);

    return data

   
};
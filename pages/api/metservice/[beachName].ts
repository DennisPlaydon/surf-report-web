// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { beaches } from "../../../app/beaches";
import getForecastData from "../../../app/helpers/getForecastData";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const { beachName } = req.query;
    const beach = beaches.filter((x) => x.name === beachName)[0];
    const json = await getForecastData(beach);
    res.status(200).send(json);
}

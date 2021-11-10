// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getForecastData from '../../app/helpers/getForecastData';
import { Beach } from '../../app/types/Beach';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const surfDateTimeIndex = 0;
  const windLevelIndex = 2;
  const periodIndex = 4;
  const faceHeightIndex = 5;

  const beaches = [
      { name: "Piha", region: "piha", location: "piha" },
      { name: "Omaha", region: "great-barrier", location: "omaha" },
      { name: "Muriwai", region: "piha", location: "muriwai-beach" },
      {
          name: "Port Waikato",
          region: "west-auckland",
          location: "port-waikato",
      },
      { name: "Waihi", region: "coromandel", location: "waihi-beach" },
  ];
  
  let result;
  let promises: Promise<String[]>[] = [];
  
  result = await Promise.all(promises)

  result.forEach(x => console.log(x))

  res.status(200).send("test")
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const faceHeightIndex = 5;
const surfDateTimeIndex = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ time: string; beaches: any; }[]>
) {
  const beaches = [
    { name: "Piha", region: "piha", location: "piha" }, 
    { name: "Omaha", region: "great-barrier", location: "omaha" }, 
    { name: "Muriwai", region: "piha", location: "muriwai-beach" },
    { name: "PortWaikato", region: "west-auckland", location: "port-waikato" }, 
    { name: "Waihi", region: "coromandel", location: "waihi-beach" }
  ]

  var combinedForecast: { [time: string] : Array<Object>} = {};
  for (let beachIndex = 0; beachIndex < beaches.length; beachIndex++) {
    const beach = beaches[beachIndex]

    const result = await fetch(
      `https://www.metservice.com/publicData/webdata/marine/regions/${beach.region}/surf/locations/${beach.location}`
    );
    const json = await result.json();
    const daysForecast: Array<String> = json["layout"]["primary"]["slots"]["main"]["modules"][0]["days"]
    
    daysForecast.forEach((individualDay: any) => {
      const surfTimes = individualDay["rows"][surfDateTimeIndex]["data"]
      const waveFaceHeights = individualDay["rows"][faceHeightIndex]["data"]
  
      for (let index = 0; index < surfTimes.length; index++) {
        const beachName: string = beach.name;
        let setFaceEntry: any = {};
        setFaceEntry[beachName] = waveFaceHeights[index]["setFace"]
  
        var newArray = combinedForecast[surfTimes[index]["at"]]
        newArray ? newArray.push(setFaceEntry) : newArray = [setFaceEntry]
        combinedForecast[surfTimes[index]["at"]] = newArray
      }
    })
  }

  const formattedData = Object.entries(combinedForecast).map(([key, values]) => ({ time: key, ...Object.assign({}, ...values) }));

  res.status(200).send(formattedData)
}
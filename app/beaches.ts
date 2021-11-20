import { Beach } from "./types/Beach";

let piha: Beach = { name: "Piha", region: "piha", location: "piha" };
let omaha: Beach = { name: "Omaha", region: "great-barrier", location: "omaha" };
let muriwai: Beach = { name: "Muriwai", region: "piha", location: "muriwai-beach" };
let portWaikato: Beach = {
    name: "Port Waikato",
    region: "west-auckland",
    location: "port-waikato",
};
let waihi: Beach = { name: "Waihi", region: "coromandel", location: "waihi-beach" };

export const beaches = [piha, omaha, muriwai, portWaikato, waihi];

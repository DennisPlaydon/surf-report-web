import { Beach } from "./types/Beach";

let piha: Beach = { name: "Piha", region: "piha", location: "piha", displayName: "Piha" }
let omaha: Beach = { name: "Omaha", region: "great-barrier", location: "omaha", displayName: "Omaha" }
let muriwai: Beach = { name: "Muriwai", region: "piha", location: "muriwai-beach", displayName: "Muriwai" }
let portWaikato: Beach = {
    name: "PortWaikato",
    region: "west-auckland",
    location: "port-waikato", displayName: "Port Waikato"
}
let waihi: Beach = { name: "Waihi", region: "coromandel", location: "waihi-beach", displayName: "Waihi" }

export const beaches = [
    piha,
    omaha,
    muriwai,
    portWaikato,
    waihi
];
import { Beach } from "./types/Beach";

// Auckland east coast
let omaha: Beach = { name: "Omaha", region: "great-barrier", location: "omaha" };
let tawharanui: Beach = { name: "Tawharanui", region: "great-barrier", location: "tawharanui" };
let longBay: Beach = { name: "Long Bay", region: "east-auckland", location: "long-bay" };

// Auckland west coast
let piha: Beach = { name: "Piha", region: "piha", location: "piha" };
let muriwai: Beach = { name: "Muriwai", region: "piha", location: "muriwai-beach" };
let portWaikato: Beach = {
    name: "Port Waikato",
    region: "west-auckland",
    location: "port-waikato",
};

// Bay of plenty
let waihi: Beach = { name: "Waihi", region: "coromandel", location: "waihi-beach" };

export const beaches = [piha, omaha, longBay, tawharanui, muriwai, portWaikato, waihi];

import type { Channel } from '../models/Channel';

export const CHANNELS: Channel[] = [
  {
    id: "rainy-lofi",
    name: "Rainy Lo-Fi",
    icon: "CloudRain",
    description: "Built for Study & Deep Focus",
    tags: ["lofi", "lo-fi", "chillhop"],
    stations: [
      { id: "lofi-1", name: "Lofi Radio (24/7)", streamUrl: "https://play.streamafrica.net/lofiradio", isLive: true },
      { id: "lofi-2", name: "FluxFM - LoFi & Chillhop", streamUrl: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/", isLive: true },
      { id: "lofi-3", name: "HotmixRadio - LoFi", streamUrl: "https://streaming.hotmixradio.com/hotmix-lofi-en-mp3", isLive: true },
      { id: "lofi-4", name: "Box Lofi Radio", streamUrl: "https://stream.zeno.fm/tabzverz0fctv", isLive: true },
      { id: "lofi-5", name: "Chillsky Beats", streamUrl: "https://chill.radioca.st/stream", isLive: true },
      { id: "lofi-6", name: "FIP Autour du Groove", streamUrl: "https://icecast.radiofrance.fr/fipgroove-midfi.mp3", isLive: true },
      { id: "lofi-7", name: "SomaFM - Groove Salad", streamUrl: "https://ice1.somafm.com/groovesalad-128-mp3", isLive: true },
      { id: "lofi-8", name: "SomaFM - Illinois Street Lounge", streamUrl: "https://ice1.somafm.com/illstreet-128-mp3", isLive: true }
    ]
  },
  {
    id: "nostalgic-indie",
    name: "Nostalgic Indie",
    icon: "Guitar",
    description: "Dreamy indie pop-rock, and melancholic acoustics",
    tags: ["indie pop", "dream pop", "shoegaze"],
    stations: [
      { id: "indie-1", name: "SomaFM - Indie Pop Rocks!", streamUrl: "https://ice1.somafm.com/indiepop-128-mp3", isLive: true },
      { id: "indie-2", name: "Dreampop Radio", streamUrl: "https://dreampopradio.stream.laut.fm/dreampopradio", isLive: true },
      { id: "indie-3", name: "SomaFM - Lush (Chilled Vocals)", streamUrl: "https://ice1.somafm.com/lush-128-mp3", isLive: true },
      { id: "indie-4", name: "SomaFM - Folk Forward", streamUrl: "https://ice1.somafm.com/folkfwd-128-mp3", isLive: true },
      { id: "indie-5", name: "FluxFM - Alternative", streamUrl: "https://streams.fluxfm.de/alternative/mp3-320/streams.fluxfm.de/", isLive: true },
      { id: "indie-6", name: "SomaFM - Boot Liquor", streamUrl: "https://ice1.somafm.com/bootliquor-128-mp3", isLive: true },
      { id: "indie-7", name: "FluxFM - 90s Archives", streamUrl: "https://streams.fluxfm.de/90er/mp3-320/streams.fluxfm.de/", isLive: true },
      { id: "indie-8", name: "FluxFM - 80s Dream", streamUrl: "https://streams.fluxfm.de/80er/mp3-320/streams.fluxfm.de/", isLive: true }
    ]
  },
  {
    id: "midnight-coding",
    name: "Midnight Coding",
    icon: "Terminal",
    description: "Synthwave and cyberpunk electronics",
    tags: ["synthwave", "cyberpunk", "retrowave", "vaporwave"],
    stations: [
      { id: "code-1", name: "Nightwave Plaza", streamUrl: "https://radio.plaza.one/mp3", isLive: true },
      { id: "code-2", name: "Nightride FM", streamUrl: "https://stream.nightride.fm/nightride.m4a", isLive: true },
      { id: "code-3", name: "SomaFM - Vaporwaves", streamUrl: "https://ice1.somafm.com/vaporwaves-128-mp3", isLive: true },
      { id: "code-4", name: "Cyberpunk FM", streamUrl: "https://cyberpunk.stream.laut.fm/cyberpunk", isLive: true },
      { id: "code-5", name: "SomaFM - DEF CON Radio", streamUrl: "https://ice1.somafm.com/defcon-128-mp3", isLive: true },
      { id: "code-6", name: "SomaFM - Space Station", streamUrl: "https://ice1.somafm.com/spacestation-128-mp3", isLive: true },
      { id: "code-7", name: "SomaFM - The Trip", streamUrl: "https://ice1.somafm.com/thetrip-128-mp3", isLive: true }
    ]
  },
  {
    id: "deep-ambient",
    name: "Deep Ambient",
    icon: "Moon",
    description: "Pure atmospheric synths & drone",
    tags: ["ambient", "drone", "dark ambient", "space ambient"],
    stations: [
      { id: "amb-1", name: "SomaFM - Drone Zone", streamUrl: "https://ice1.somafm.com/dronezone-128-mp3", isLive: true },
      { id: "amb-2", name: "SomaFM - Deep Space One", streamUrl: "https://ice1.somafm.com/deepspaceone-128-mp3", isLive: true },
      { id: "amb-3", name: "SomaFM - Space Station", streamUrl: "https://ice1.somafm.com/spacestation-128-mp3", isLive: true },
      { id: "amb-4", name: "SomaFM - Mission Control", streamUrl: "https://ice1.somafm.com/missioncontrol-128-mp3", isLive: true },
      { id: "amb-5", name: "Ambient Sleeping Pill", streamUrl: "https://radio.stereoscenic.com/asp-s", isLive: true },
      { id: "amb-6", name: "SomaFM - Synphaera", streamUrl: "https://ice1.somafm.com/synphaera-128-mp3", isLive: true },
      { id: "amb-7", name: "SomaFM - SF 10-33", streamUrl: "https://ice1.somafm.com/sf1033-128-mp3", isLive: true }
    ]
  },
  {
    id: "classic-jazz",
    name: "Classic Jazz",
    icon: "Music",
    description: "Traditional, bebop, and smooth jazz",
    tags: ["jazz", "bebop", "cool jazz", "hard bop"],
    stations: [
      { id: "jazz-1", name: "Radio Swiss Jazz", streamUrl: "https://stream.srg-ssr.ch/m/rsj/mp3_128", isLive: true },
      { id: "jazz-2", name: "FIP Autour du Jazz", streamUrl: "https://icecast.radiofrance.fr/fipjazz-midfi.mp3", isLive: true },
      { id: "jazz-3", name: "WBGO Jazz (New York)", streamUrl: "https://ais-sa8.cdnstream1.com/3629_128.mp3", isLive: true },
      { id: "jazz-4", name: "TSF Jazz (Paris)", streamUrl: "https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3", isLive: true },
      { id: "jazz-5", name: "WRTI Jazz (Philadelphia)", streamUrl: "https://wrti-icy.streamguys1.com/jazz", isLive: true }
    ]
  },
  {
    id: "classical-focus",
    name: "Classical Focus",
    icon: "BookOpen",
    description: "Piano, strings, and orchestral",
    tags: ["classical", "piano", "orchestral", "baroque"],
    stations: [
      { id: "clas-1", name: "WQXR (New York Public Radio)", streamUrl: "https://stream.wqxr.org/wqxr", isLive: true },
      { id: "clas-2", name: "All Classical Portland", streamUrl: "https://allclassical.streamguys1.com/ac96k", isLive: true },
      { id: "clas-3", name: "NPO Klassiek (Netherlands)", streamUrl: "https://icecast.omroep.nl/radio4-bb-mp3", isLive: true }
    ]
  }
];
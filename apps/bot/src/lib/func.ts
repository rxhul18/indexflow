import { CONFIG } from "../configs/config";
import {
  AnonProfileType,
  ConfigType,
  IndexAnsType,
  IndexQnsType,
  ServerType,
  ServerUpdateType,
  TagType,
  TagUpdateType,
} from "../types";

const api = CONFIG.BOT_API_ENDPOINT;
const bearer = CONFIG.BOT_BEARER_TOKEN;
const anonNames = [
  "Ziggy Zap",
  "Bobo Bouncer",
  "Muffin McFluff",
  "Trixie Turbo",
  "Snappy Snap",
  "Blinky Blink",
  "Jumbo Jinks",
  "Waldo Wobble",
  "Gizmo Gears",
  "Momo Mischief",
  "Doodle Doo",
  "Pogo Pop",
  "Ricky Rumble",
  "Sparky Sprocket",
  "Zippy Zonk",
  "Coco Crunch",
  "Fluffy Floof",
  "Buster Boom",
  "Peppy Pebble",
  "Quacky Quirk",
  "Whizzy Wiz",
  "Jelly Jolt",
  "Benny Bounce",
  "Lulu Loco",
  "Dizzy Doodle",
  "Wacky Whirl",
  "Milo Mischief",
  "Sunny Sprout",
  "Goofy Goo",
  "Fuzzy Fizz",
  "Rex Rocket",
  "Scooter Skip",
  "Bumpy Boop",
  "Zazu Zing",
  "Hopper Hoot",
  "Pippa Pounce",
  "Choco Chum",
  "Wobble Woo",
  "Nibbles Nox",
  "Zelda Zoom",
  "Taffy Twirl",
  "Boomer Bing",
  "Gogo Glee",
  "Mopsy Mop",
  "Fizzy Flare",
  "Chippy Chomp",
  "Tinker Tot",
  "Yoyo Yaps",
  "Bingo Blip",
  "Jinx Jangle",
  "Doodle Dap",
  "Spunky Sprig",
  "Toto Twizzle",
  "Zuzu Zap",
  "Blinky Boing",
  "Doodle Dazz",
  "Mochi Muddle",
  "Snickers Snoot",
  "Bobo Blink",
  "Zaza Zonk",
  "Chilly Cheeks",
  "Snazzy Snout",
  "Waffle Whiz",
  "Zippy Zap",
  "Twinkle Tock",
  "Giggles Goop",
  "Hiccup Hoo",
  "Noodle Nib",
  "Squeaky Splotch",
  "Flicky Fudge",
  "Boomerang Bob",
  "Nibbler Nix",
  "Floppo Fizz",
  "Kiki Krackle",
  "Bibbity Bop",
  "Lolly Lick",
  "Flapper Floof",
  "Wobbly Wump",
  "Tootsie Tot",
  "Quirky Quill",
  "Zizzle Zonk",
  "Scootie Scoot",
  "Fizzle Fizz",
  "Rascal Riff",
  "Chirp Chonk",
  "Snappy Snoot",
  "Goober Gloop",
  "Cuddly Crumb",
  "Blinky Boop",
  "Tizzy Tock",
  "Taco Tangle",
  "Jumpy Jot",
  "Muffin Muddle",
  "Razzle Riff",
  "Skippy Skribble",
  "Momo Mingle",
  "Gummy Grizzle",
  "Twiddle Twee",
  "Mango Muddle",
  "Loppy Lush",
  "Fizzy Fuzz",
  "Toasty Tumble",
  "Flopsy Fluff",
  "Topsy Turvy",
  "Giddy Goo",
  "Snicker Snooze",
  "Bumpy Bop",
  "Jazzy Jinx",
  "Plinky Plop",
  "Jolly Jots",
  "Bumpy Bizz",
  "Bubba Blip",
  "Ruffles Ruckus",
  "Tango Twiddle",
  "Whimsy Whirl",
  "Bouncy Bop",
  "Gizmo Glitch",
  "Peppy Pip",
  "Flippy Flare",
  "Snazzy Snoop",
  "Blinky Bloop",
  "Puddle Pug",
  "Gobbles Gunk",
  "Snickers Snout",
  "Toto Tweak",
  "Twiddle Twix",
  "Momo Muddle",
  "Sizzle Snap",
  "Hobnob Hop",
  "Squiggle Spritz",
  "Jiggle Jolt",
  "Flitter Fizz",
  "Zappy Zap",
  "Whizzy Wham",
  "Nifty Nix",
  "Bumbly Boop",
  "Jolly Jangle",
  "Tickle Tock",
  "Hiccup Hop",
  "Muffin Moof",
  "Chomper Chuck",
  "Scooter Splat",
  "Bibbity Blink",
  "Snappy Snapper",
  "Doodle Doodle",
  "Tango Tizzy",
  "Bouncy Biscuit",
  "Snazzy Sprinkle",
  "Jitter Jolt",
  "Zappy Zang",
  "Tootsie Twang",
  "Floppy Flip",
  "Giggle Glitch",
  "Sizzle Snort",
  "Blinky Bop",
  "Wobble Wiggle",
  "Fluffy Fizz",
  "Goofy Goof",
  "Squiggle Splat",
  "Toasty Twiddle",
  "Bubbly Bop",
  "Riff Raffy",
  "Tickle Tickle",
  "Gizmo Grin",
  "Twinkle Twang",
  "Cocoa Crunch",
  "Momo Mocha",
  "Jazzy Jot",
  "Doodle Dip",
  "Quirky Quirk",
  "Chirpy Chum",
  "Tizzy Twinkle",
  "Scooter Scooch",
  "Bumpy Bounce",
  "Snicker Snicker",
  "Lolly Lush",
  "Giddy Gobble",
  "Bongo Boop",
  "Tango Twizzle",
  "Muffin Munch",
  "Skippy Skip",
  "Choco Chunk",
  "Froggy Flip",
  "Squeaky Splat",
  "Blinky Blink",
  "Wobble Wump",
  "Zesty Zing",
  "Fluffo Fizz",
  "Mango Mingle",
  "Fizzy Fizzle",
  "Snickers Snag",
  "Scootie Scoot",
  "Wacky Wobble",
  "Chubby Chuck",
  "Dizzy Doodle",
  "Tinker Tumble",
  "Snappy Snip",
  "Bumpy Bunk",
  "Gobbly Goo",
  "Fuzzy Floof",
  "Flippy Fluff",
  "Lulu Lick",
  "Toasty Toodle",
  "Fizzy Fuddle",
  "Bobo Boodle",
];

function getRandomAnonName(): string {
  const randomName = anonNames[Math.floor(Math.random() * anonNames.length)];
  const randomSuffix = Math.random().toString(36).slice(-3).toLowerCase(); // Generates a 3-character alphanumeric string
  return `${randomName} ${randomSuffix}.iflow`;
}

async function createTag(tagData: TagType) {
  const response = await fetch(`${api}/tag/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tagData),
  });
  const data = await response.json();
  return data;
}

async function updateTag(tagData: TagUpdateType) {
  const response = await fetch(`${api}/tag/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tagData),
  });
  const data = await response.json();
  return data;
}

async function createServer(serverData: ServerType) {
  const response = await fetch(`${api}/server/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serverData),
  });
  const data = await response.json();
  return data;
}

async function updateServer(serverData: ServerUpdateType) {
  const response = await fetch(`${api}/server/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serverData),
  });
  const data = await response.json();
  return data;
}

async function getServerById(id: string) {
  const response = await fetch(`${api}/server/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { success: false, response };
  }

  const data = await response.json();
  return { success: true, data };
}

async function getDbStats() {
  const response = await fetch(`${api}/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { success: false, response };
  }

  const data = await response.json();
  return { success: true, data };
}

async function createServerConfig(serverConfigData: ConfigType) {
  const response = await fetch(`${api}/server/config/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serverConfigData),
  });
  const data = await response.json();
  return data;
}

async function getServerConfigById(id: string) {
  const response = await fetch(`${api}/server/config/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { success: false, response };
  }

  const data = await response.json();
  return { success: true, data };
}

async function indexQns(QnsData: IndexQnsType) {
  const response = await fetch(`${api}/index/qns/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(QnsData),
  });
  const data = await response.json();
  return data;
}

async function indexAns(AnsData: IndexAnsType) {
  const response = await fetch(`${api}/index/ans/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(AnsData),
  });
  const data = await response.json();
  return data;
}

async function createAnonProfile(ProfileData: AnonProfileType) {
  const response = await fetch(`${api}/profile/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ProfileData),
  });
  const data = await response.json();
  return data;
}

async function getAnonProfileById(id: string) {
  const response = await fetch(`${api}/profile/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { success: false, response };
  }

  const data = await response.json();
  return { success: true, data };
}

export {
  createServer,
  getServerById,
  indexAns,
  indexQns,
  createServerConfig,
  getServerConfigById,
  getDbStats,
  getRandomAnonName,
  createAnonProfile,
  getAnonProfileById,
  updateServer,
  createTag,
  updateTag,
};

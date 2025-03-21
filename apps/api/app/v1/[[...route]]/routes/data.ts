import { Hono } from "hono";

// const CACHE_EXPIRY = 150;

const data = new Hono();

export type DataApiType = typeof data;
export default data;

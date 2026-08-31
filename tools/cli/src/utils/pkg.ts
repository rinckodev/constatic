export const { default: pkg } = await import(
    "../../package.json", 
    { with: { type: "json" } }
);